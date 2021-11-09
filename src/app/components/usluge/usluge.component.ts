import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { KursService } from '../../services/kurs.service';
import { PrakticnaObukaService } from '../../services/prakticna-obuka.service';
import { DogadjajiService } from '../../services/dogadjaji.service';

import { Kurs } from 'src/app/models/Kurs';
import { Prakticne } from 'src/app/models/Prakticne';
import { Dogadjaj } from 'src/app/models/Dogadjaj';

@Component({
  selector: 'app-usluge',
  templateUrl: './usluge.component.html',
  styleUrls: ['./usluge.component.css']
})
export class UslugeComponent implements OnInit {
  kursPet: Kurs[] = [];
  kursevi: Kurs[];
  obukePet: Prakticne[] = [];
  obuke: Prakticne[];
  dogadjajiPet: Dogadjaj[] = [];
  dogadjaji: Dogadjaj[];
  list = [0, 1, 2, 3, 4];

  constructor(private kursService: KursService,
              private obukeService: PrakticnaObukaService,
              private dogadjajiService: DogadjajiService,
              private storage: AngularFireStorage) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.kursService.sviKursevi().subscribe(kursevi => {
      this.kursevi = kursevi;
      this.kursevi.forEach(cur => {
        const ref = this.storage.ref(`Kursevi/${cur.Naslov}`);
        cur.Slika = ref.getDownloadURL();
      });
      for (const i in this.list) {
        if (this.kursevi[0] !== undefined) {
          this.kursPet.push(this.kursevi[0]);
          this.kursevi = this.kursevi.filter(obj => obj !== this.kursevi[0]);
        }
      }
    });
    this.obukeService.sveObuke().subscribe(obuke => {
      this.obuke = obuke;
      this.obuke.forEach(cur => {
        const ref = this.storage.ref(`Obuke/${cur.Naslov}`);
        cur.Slika = ref.getDownloadURL();
      });
      for (const i in this.list) {
        if (this.obuke[0] !== undefined) {
          this.obukePet.push(this.obuke[0]);
          this.obukePet = this.obuke.filter(obj => obj !== this.obuke[0]);
        }
      }
    });
    this.dogadjajiService.sviDogadjaji().subscribe(dogadjaji => {
      this.dogadjaji = dogadjaji;
      this.dogadjaji.forEach(cur => {
        const ref = this.storage.ref(`Dogadjaji/${cur.Naslov}`);
        cur.Slika = ref.getDownloadURL();
      });
      for (const i in this.list) {
        if (this.dogadjaji[0] !== undefined) {
          this.dogadjajiPet.push(this.dogadjaji[0]);
          this.dogadjajiPet = this.dogadjaji.filter(obj => obj !== this.dogadjaji[0]);
        }
      }
    });
  }
  loadKurs() {
    for (const i in this.list) {
      if (this.kursevi[0] !== undefined) {
        this.kursPet.push(this.kursevi[0]);
        this.kursevi = this.kursevi.filter(obj => obj !== this.kursevi[0]);
      }
    }
  }
  loadObuke() {
    for (const i in this.list) {
      if (this.obuke[0] !== undefined) {
        this.obukePet.push(this.obuke[0]);
        this.obuke = this.obuke.filter(obj => obj !== this.obuke[0]);
      }
    }
  }
  loadDogadjaji() {
    for (const i in this.list) {
      if (this.dogadjaji[0] !== undefined) {
        this.dogadjajiPet.push(this.dogadjaji[0]);
        this.dogadjaji = this.dogadjaji.filter(obj => obj !== this.dogadjaji[0]);
      }
    }
  }
}
