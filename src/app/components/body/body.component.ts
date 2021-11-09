import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

import { KursService } from '../../services/kurs.service';
import { PrakticnaObukaService } from '../../services/prakticna-obuka.service';
import { DogadjajiService } from '../../services/dogadjaji.service';

import { Kurs } from '../../models/Kurs';
import { Prakticne } from '../../models/Prakticne';
import { Dogadjaj } from '../../models/Dogadjaj';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
  kursevi: Kurs[];
  prakticne: Prakticne[];
  dogadjaji: Dogadjaj[];

  constructor(private kursService: KursService,
              private prakticneService: PrakticnaObukaService,
              private dogadjajiService: DogadjajiService,
              private storage: AngularFireStorage) { }

  ngOnInit() {
    this.kursService.get5().subscribe(kursevi => {
      this.kursevi = kursevi;
      this.kursevi.forEach(cur => {
        const ref = this.storage.ref(`Kursevi/${cur.Naslov}`);
        cur.Slika = ref.getDownloadURL();
        cur.Opis = jQuery.htmlPrefilter(cur.Opis).toString().substring(0, 150) + '...';
      });
    });
    this.prakticneService.get5().subscribe(obuke => {
      this.prakticne = obuke;
      this.prakticne.forEach(cur => {
        const ref = this.storage.ref(`Obuke/${cur.Naslov}`);
        cur.Slika = ref.getDownloadURL();
      });
    });
    this.dogadjajiService.get5().subscribe(dogadjaji => {
      this.dogadjaji = dogadjaji;
      this.dogadjaji.forEach(cur => {
        const ref = this.storage.ref(`Dogadjaji/${cur.Naslov}`);
        cur.Slika = ref.getDownloadURL();
      });
    });
  }

}
