import { Component, OnInit } from '@angular/core';

import { VijestiService } from '../../../services/vijesti.service';
import { KategorijeVijestiService } from '../../../services/kategorije-vijesti.service';
import { ComfirmationDialogService } from '../../confirmation-dialog/comfirmation-dialog.service';
import { FlashMessagesService } from 'angular2-flash-messages';

import { Vijest } from '../../../models/Vijest';
import { KategorijaVijesti } from 'src/app/models/KategorijaVijesti';

@Component({
  selector: 'app-sve-vijesti',
  templateUrl: './sve-vijesti.component.html',
  styleUrls: ['./sve-vijesti.component.css']
})
export class SveVijestiComponent implements OnInit {
  pretraga = '';
  selected = 'Sve vijesti';
  filter: Vijest[] = [];
  vijesti: Vijest[];
  kategorije: KategorijaVijesti[];
  constructor(private vijestiService: VijestiService,
              private kategorijeService: KategorijeVijestiService,
              private cds: ComfirmationDialogService,
              private fm: FlashMessagesService) { }

  ngOnInit(): void {
    this.vijestiService.getProducts().subscribe(vijesti => {
      this.vijesti = vijesti;
    });
    this.kategorijeService.getKategorijeVijesti().subscribe(kategorije => {
      this.kategorije = kategorije;
    });
  }
  onChange() {
    this.vijestiService.getByKategorija(this.selected).subscribe(vijesti => {
      this.vijesti = vijesti;
    });
  }
  pretrazi() {
    if (this.pretraga === '') {this.vijestiService.getProducts().subscribe(vijesti => {
      this.vijesti = vijesti;
    }); } else {
      this.vijestiService.getProducts().subscribe(vijesti => {
        this.vijesti = vijesti;
        this.filter = this.vijesti.filter((vijest: Vijest) => vijest.Naslov.toLowerCase().includes(this.pretraga.toLowerCase()));
        this.vijesti = this.filter;
      });
    }
  }
  onDeleteClick(vijest: Vijest) {
    this.cds.confirm('Pažnja', `Jeste li sigurni da želite obrisati vijest ${vijest.Naslov} ?`)
    .then(confirmed => {
      if (confirmed === false) {
        this.fm.show('Vijest je uspješno obrisana', {cssClass: 'alert-success', timeout: 3000});
        this.vijestiService.DeleteVijest(vijest);
      }
    });
  }
}
