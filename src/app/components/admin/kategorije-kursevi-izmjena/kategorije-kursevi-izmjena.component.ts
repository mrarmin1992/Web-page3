import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { KategorijeKurseviService } from '../../../services/kategorije-kursevi.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { KursService } from '../../../services/kurs.service';
import { PrakticnaObukaService } from '../../../services/prakticna-obuka.service';

import { KategorijaKurs } from '../../../models/KategorijaKurs';
import { Kurs } from 'src/app/models/Kurs';

@Component({
  selector: 'app-kategorije-kursevi-izmjena',
  templateUrl: './kategorije-kursevi-izmjena.component.html',
  styleUrls: ['./kategorije-kursevi-izmjena.component.css']
})
export class KategorijeKurseviIzmjenaComponent implements OnInit {
  stara: string;
  kategorija: KategorijaKurs = {
    Naziv: ''
  };
  id: string;
  kursevi: Kurs[];
  constructor(private kategorijeKurseviService: KategorijeKurseviService,
              private router: Router,
              private route: ActivatedRoute,
              private fm: FlashMessagesService,
              private kursService: KursService,
              private obukeService: PrakticnaObukaService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.kategorijeKurseviService.getKategorijaKurs(this.id).subscribe(kategorija => {
      this.kategorija = kategorija;
      this.stara = kategorija.Naziv;
    });
  }
  onSubmit({value, valid}: {value: KategorijaKurs, valid: boolean}) {
    if (!valid) {
      console.log(valid);
    } else {
        this.kategorijeKurseviService.updateKategorijaKurs(value, this.id);
        this.kursService.getByKategorija(this.stara).forEach(values => {
          values.forEach(doc => {
            this.kursService.updateKategorija(doc, this.kategorija.Naziv);
          });
        });
        this.obukeService.getByKategorija(this.stara).forEach(values => {
          values.forEach(doc => {
            this.obukeService.updateKategorija(doc, this.kategorija.Naziv);
          });
        });
        this.fm.show('Kategorija je uspješno izmijenjena', { cssClass: 'alert-success', timeout: 3000 });
        this.router.navigate([`/dashboard/kategorije-kursevi`]);
    }
  }
}
