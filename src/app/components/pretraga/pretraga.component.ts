import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { VijestiService } from '../../services/vijesti.service';
import { KursService } from '../../services/kurs.service';
import { PrakticnaObukaService } from '../../services/prakticna-obuka.service';
import { DogadjajiService } from '../../services/dogadjaji.service';
import { AngularFireStorage } from '@angular/fire/storage';

import { Vijest } from 'src/app/models/Vijest';
import { Kurs } from 'src/app/models/Kurs';
import { Prakticne } from 'src/app/models/Prakticne';
import { Dogadjaj } from 'src/app/models/Dogadjaj';

@Component({
  selector: 'app-pretraga',
  templateUrl: './pretraga.component.html',
  styleUrls: ['./pretraga.component.css']
})
export class PretragaComponent implements OnInit {
  filter: any;
  pretraga: any;
  vijesti: Vijest[];
  kursevi: Kurs[];
  obuke: Prakticne[];
  dogadjaji: Dogadjaj[];

  constructor(private vijestiService: VijestiService,
              private storage: AngularFireStorage,
              private kursService: KursService,
              private obukeService: PrakticnaObukaService,
              private dogadjajiService: DogadjajiService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.pretraga = this.route.snapshot.params.p;

    this.vijestiService.getVijesti().subscribe(vijesti => {
      this.vijesti = vijesti;
      this.filter = this.vijesti.filter((vijest: Vijest) => vijest.Naslov.toLowerCase().includes(this.pretraga.toLowerCase()));
      this.vijesti = this.filter;
      this.vijesti.forEach(doc => {
        const ref = this.storage.ref(`Vijesti/${doc.Podnaslov}`);
        doc.Slika = ref.getDownloadURL();
        doc.Sadrzaj = doc.Sadrzaj.substring(0, 400);
        doc.Sadrzaj = jQuery(doc.Sadrzaj).text();
      });
    });
    this.kursService.sviKursevi().subscribe(kursevi => {
      this.kursevi = kursevi;
      this.filter = this.kursevi.filter((kurs: Kurs) => kurs.Naslov.toLowerCase().includes(this.pretraga.toLowerCase()));
      this.kursevi = this.filter;
      this.kursevi.forEach(doc => {
        const ref = this.storage.ref(`Kursevi/${doc.Naslov}`);
        doc.Slika = ref.getDownloadURL();
      });
    });
    this.obukeService.sveObuke().subscribe(obuke => {
      // this.obuke = obuke;
      this.filter = obuke.filter((obuka: Prakticne) => obuka.Naslov.toLowerCase().includes(this.pretraga.toLowerCase()));
      this.obuke = this.filter;
      this.obuke.forEach(doc => {
        const ref = this.storage.ref(`Obuke/${doc.Naslov}`);
        doc.Slika = ref.getDownloadURL();
      });
    });
    this.dogadjajiService.sviDogadjaji().subscribe(dogadjaji => {
      // this.dogadjaji = dogadjaji;
      this.filter = dogadjaji.filter((dogadjaj: Dogadjaj) => dogadjaj.Naslov.toLowerCase().includes(this.pretraga.toLowerCase()));
      this.dogadjaji = this.filter;
      this.dogadjaji.forEach(doc => {
        const ref = this.storage.ref(`Dogadjaji/${doc.Naslov}`);
        doc.Slika = ref.getDownloadURL();
      });
    });
  }

}
