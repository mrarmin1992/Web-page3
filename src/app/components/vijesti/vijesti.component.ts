import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

import { VijestiService } from '../../services/vijesti.service';
import { DogadjajiService } from '../../services/dogadjaji.service';

import { Vijest } from '../../models/Vijest';
import { Dogadjaj } from 'src/app/models/Dogadjaj';

@Component({
  selector: 'app-vijesti',
  templateUrl: './vijesti.component.html',
  styleUrls: ['./vijesti.component.css']
})
export class VijestiComponent implements OnInit {
  vijesti: Vijest[];
  dogadjaji: Dogadjaj[];
  constructor(private vijestiService: VijestiService,
              private storage: AngularFireStorage,
              private dogadjajService: DogadjajiService) { }

  ngOnInit() {
    this.vijestiService.getVijesti().subscribe(vijesti => {
      vijesti.forEach(cur => {
        const ref = this.storage.ref(`Vijesti/${cur.Podnaslov}`);
        cur.Slika = ref.getDownloadURL();
      });
      this.vijesti = vijesti;
    });
    this.dogadjajService.sviDogadjaji().subscribe(dogadjaji => {
      dogadjaji.forEach(doc => {
        const ref = this.storage.ref(`Dogadjaji/${doc.Naslov}`);
        doc.Slika = ref.getDownloadURL();
      });
      this.dogadjaji = dogadjaji;
    });
  }

}
