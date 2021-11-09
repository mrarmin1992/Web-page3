import { Component, OnInit } from '@angular/core';

import { FlashMessagesService } from 'angular2-flash-messages';
import { ComfirmationDialogService } from '../../confirmation-dialog/comfirmation-dialog.service';
import { KategorijeKurseviService } from '../../../services/kategorije-kursevi.service';

import { KategorijaKurs } from '../../../models/KategorijaKurs';

@Component({
  selector: 'app-kategorije-kursevi',
  templateUrl: './kategorije-kursevi.component.html',
  styleUrls: ['./kategorije-kursevi.component.css']
})
export class KategorijeKurseviComponent implements OnInit {
  kategorije: KategorijaKurs[];
  constructor(private kategorijeKurseviService: KategorijeKurseviService,
              private fm: FlashMessagesService,
              private cds: ComfirmationDialogService) { }

  ngOnInit(): void {
    this.kategorijeKurseviService.getKategorijeKursevi().subscribe(kategorije => {
      this.kategorije = kategorije;
    });
  }
  onDeleteClick(kategorija: KategorijaKurs) {
    this.cds.confirm('Pažnja', `Jeste li sigurni da želite obrisati kategoriju ${kategorija.Naziv} ?`)
    .then(confirmed => {
      if (confirmed === false) {
        this.fm.show('Kategorija je uspješno obrisana', {cssClass: 'alert-success', timeout: 3000});
        this.kategorijeKurseviService.deleteKategorijaKurs(kategorija.Id);
      }
    });
  }
}
