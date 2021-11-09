import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

import { KursService } from '../../services/kurs.service';
import { PrakticnaObukaService } from '../../services/prakticna-obuka.service';

import { Kurs } from '../../models/Kurs';
import { Prakticne } from '../../models/Prakticne';
import { Aktivni } from '../../models/Aktivni';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ukljuci-se',
  templateUrl: './ukljuci-se.component.html',
  styleUrls: ['./ukljuci-se.component.css']
})
export class UkljuciSeComponent implements OnInit {
  temp: Aktivni;
  aktivni: Aktivni[] = [];
  kursevi: Kurs[];
  obuke: Prakticne[];
  constructor(private kursService: KursService,
              private storage: AngularFireStorage,
              private prakticneService: PrakticnaObukaService) { }

  ngOnInit() {
    this.kursService.getAktivni().subscribe(kursevi => {
      this.kursevi = kursevi;
      this.kursevi.forEach(doc => {
        const ref = this.storage.ref(`Kursevi/${doc.Naslov}`);
        // tslint:disable-next-line: max-line-length
        this.aktivni.push({Id: doc.Id, Naslov: doc.Naslov, Opis: jQuery.htmlPrefilter(doc.Opis).toString().substring(0, 200) + '...', Slika: ref.getDownloadURL(), Vrsta: false, Dugme: 'Prijavi se'});
      });
    });
    this.prakticneService.getAktivni().subscribe(obuke => {
      this.obuke = obuke;
      this.obuke.forEach(doc => {
        const ref = this.storage.ref(`Obuke/${doc.Naslov}`);
        // tslint:disable-next-line: max-line-length
        this.aktivni.push({Id: doc.Id, Naslov: doc.Naslov, Opis: jQuery.htmlPrefilter(doc.Opis).toString().substring(0, 200) + '...', Slika: ref.getDownloadURL(), Vrsta: true, Dugme: 'Prijavi se'});
      });
    });
    const slik = this.storage.ref(`Onama/onama.jpg`);
    console.log(slik);
    // tslint:disable-next-line: max-line-length
    this.aktivni.push({Id: undefined, Naslov: 'Lokalno partnerstvo za obrazovanje odraslih', Opis: '', Slika: slik.getDownloadURL(), Vrsta: null, Dugme: 'O nama'});
  }
}
