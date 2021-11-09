import { Component, OnInit } from '@angular/core';

import { DogadjajiService } from '../../../services/dogadjaji.service';
import { KategorijeKurseviService } from '../../../services/kategorije-kursevi.service';
import { ComfirmationDialogService } from '../../confirmation-dialog/comfirmation-dialog.service';
import { FlashMessagesService } from 'angular2-flash-messages';

import { Dogadjaj } from '../../../models/Dogadjaj';
import { KategorijaKurs } from 'src/app/models/KategorijaKurs';

@Component({
  selector: 'app-dogadjaji',
  templateUrl: './dogadjaji.component.html',
  styleUrls: ['./dogadjaji.component.css']
})
export class DogadjajiComponent implements OnInit {
  pretraga = '';
  selected = 'Svi događaji';
  filter: Dogadjaj[] = [];
  dogadjaji: Dogadjaj[];
  kategorije: KategorijaKurs[];
  constructor(private dogadjajiService: DogadjajiService,
              private kategorijeService: KategorijeKurseviService,
              private cds: ComfirmationDialogService,
              private fm: FlashMessagesService) { }

  ngOnInit(): void {
    this.dogadjajiService.getDogadjaji().subscribe(dogadjaji => {
      this.dogadjaji = dogadjaji;
    });
    this.kategorijeService.getKategorijeKursevi().subscribe(kategorije => {
      this.kategorije = kategorije;
    });
  }
  onChange() {
    this.dogadjajiService.getByKategorija(this.selected).subscribe(dogadjaji => {
      this.dogadjaji = dogadjaji;
    });
  }
  pretrazi() {
    if (this.pretraga === '') {this.dogadjajiService.getDogadjaji().subscribe(dogadjaji => {
      this.dogadjaji = dogadjaji;
    }); } else {
      this.dogadjajiService.getDogadjaji().subscribe(dogadjaji => {
        this.dogadjaji = dogadjaji;
        this.filter = this.dogadjaji.filter((dogadjaj: Dogadjaj) => dogadjaj.Naslov.toLowerCase().includes(this.pretraga.toLowerCase()));
        this.dogadjaji = this.filter;
      });
    }
  }
  onDeleteClick(dogadjaj: Dogadjaj) {
    this.cds.confirm('Pažnja', `Jeste li sigurni da želite obrisati događaj ${dogadjaj.Naslov} ?`)
    .then(confirmed => {
      if (confirmed === false) {
        this.fm.show('Događaj je uspješno obrisan', {cssClass: 'alert-success', timeout: 3000});
        this.dogadjajiService.deleteDogadjaj(dogadjaj);
      }
    });
  }

}
