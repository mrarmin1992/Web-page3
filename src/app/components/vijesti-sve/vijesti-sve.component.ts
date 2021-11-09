import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { VijestiService } from '../../services/vijesti.service';
import { AngularFireStorage } from '@angular/fire/storage';

import { Vijest } from 'src/app/models/Vijest';



@Component({
  selector: 'app-vijesti-sve',
  templateUrl: './vijesti-sve.component.html',
  styleUrls: ['./vijesti-sve.component.css']
})
export class VijestiSveComponent implements OnInit {
  vijesti: Vijest[];
  pageOfItems: Array<any>;
  pageSize = 12;
  items = [];
  constructor(private vijestiService: VijestiService,
              private storage: AngularFireStorage) { }

  ngOnInit(): void {
    this.vijestiService.getVijesti().subscribe(vijesti => {
      this.vijesti = vijesti;
      this.vijesti.forEach(doc => {
        const ref = this.storage.ref(`Vijesti/${doc.Podnaslov}`);
        doc.Slika = ref.getDownloadURL();
        doc.Sadrzaj = doc.Sadrzaj.substring(0, 400);
        doc.Sadrzaj = jQuery(doc.Sadrzaj).text();
      });
      // tslint:disable-next-line: max-line-length
      this.items = this.vijesti.map((x, i) => ({ id: (i + 1), Naslov: x.Naslov, Id: x.Id, Podnaslov: x.Podnaslov, Slika: x.Slika, Kategorija: x.Kategorija, Sadrzaj: x.Sadrzaj, Datum: x.Datum, Objava: x.Objava}));
    });
  }
  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
}
}
