import { Component, OnInit } from '@angular/core';

import { KategorijaVijesti } from '../../../models/KategorijaVijesti';
import { KategorijeVijestiService } from '../../../services/kategorije-vijesti.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ComfirmationDialogService } from '../../confirmation-dialog/comfirmation-dialog.service';

@Component({
  selector: 'app-kategorije-vijesti',
  templateUrl: './kategorije-vijesti.component.html',
  styleUrls: ['./kategorije-vijesti.component.css']
})
export class KategorijeVijestiComponent implements OnInit {
  kategorijeVijesti: KategorijaVijesti[];
  constructor(private kategorije: KategorijeVijestiService,
              private fm: FlashMessagesService,
              private cds: ComfirmationDialogService) { }

  ngOnInit(): void {
    this.kategorije.getKategorijeVijesti().subscribe(kategorije => {
      this.kategorijeVijesti = kategorije;
    });
  }
  onDeleteClick(kategorija: KategorijaVijesti) {
    this.cds.confirm('Pažnja', `Jeste li sigurni da želite obrisati kategoriju ${kategorija.Naziv} ?`)
    .then(confirmed => {
      if (confirmed === false) {
        this.fm.show('Kategorija je uspješno obrisana', {cssClass: 'alert-success', timeout: 3000});
        this.kategorije.deleteKategorijaVijesti(kategorija.Id);
      }
    });
  }
}
