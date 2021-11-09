import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestoreDocument } from '@angular/fire/firestore';

import { PrijavaService } from '../../../services/prijava.service';
import { ComfirmationDialogService } from '../../confirmation-dialog/comfirmation-dialog.service';
import { FlashMessagesService } from 'angular2-flash-messages';

import { Prijava } from '../../../models/Prijava';
import { Observable } from 'rxjs';
import { data } from 'jquery';

@Component({
  selector: 'app-prijave',
  templateUrl: './prijave.component.html',
  styleUrls: ['./prijave.component.css']
})
export class PrijaveComponent implements OnInit {
  private itemDoc: AngularFirestoreDocument<Prijava>;
  naziv: string;
  pretraga: string;
  selectedObj = 'Svi događaji';
  events: string[] = [];
  filter: Prijava[];
  prijave: Prijava[];

  constructor(private prijavaService: PrijavaService,
              private route: ActivatedRoute,
              private fm: FlashMessagesService,
              private cds: ComfirmationDialogService) { }

  ngOnInit(): void {
    this.naziv = this.route.snapshot.params.p;
    if (this.naziv !== undefined) {
      this.prijavaService.getByDogadjaj(this.naziv).subscribe(prijave => {
        this.prijave = prijave;
        this.selectedObj = this.naziv;
        this.prijave.forEach(doc => {
          this.events.unshift(doc.EventNaziv);
          this.events = Array.from(new Set(this.events));
        });
      });
    } else {
      this.prijavaService.getPrijave().subscribe(prijave => {
        this.prijave = prijave;
        this.prijave.forEach(doc => {
          this.events.unshift(doc.EventNaziv);
          this.events = Array.from(new Set(this.events));
        });
      });
    }
  }
  delete(prijava: Prijava) {
    this.cds.confirm('Pažnja', `Jeste li sigurni da želite obrisati prijavu od ${prijava.Ime} ${prijava.Prezime} ?`)
    .then(confirmed => {
      if (confirmed === false) {
        this.fm.show('Prijava je uspješno obrisana', {cssClass: 'alert-success', timeout: 3000});
        this.prijavaService.deletePrijava(prijava);
      }
    });
  }
  onChange() {
    this.prijavaService.getByDogadjaj(this.selectedObj).subscribe(prijave => {
      this.prijave = prijave;
      this.prijave.forEach(doc => {
        this.events.unshift(doc.EventNaziv);
        this.events = Array.from(new Set(this.events));
      });
    });
    this.pretraga = '';
  }
  pretrazi() {
    if (this.pretraga === '') {this.prijavaService.getPrijave().subscribe(prijave => {
      this.prijave = prijave;
      this.events = [];
      this.prijave.forEach(doc => {
        this.events.unshift(doc.EventNaziv);
        this.events = Array.from(new Set(this.events));
      });
    }); } else {
      this.prijavaService.getPrijave().subscribe(prijave => {
        this.prijave = prijave;
        // tslint:disable-next-line: max-line-length
        this.filter = this.prijave.filter((prijava: Prijava) =>
          // tslint:disable-next-line: max-line-length
          prijava.Ime.toLowerCase().includes(this.pretraga.toLowerCase()) || prijava.Prezime.toLowerCase().includes(this.pretraga.toLowerCase()) );
        this.prijave = this.filter;
        this.events = [];
        this.prijave.forEach(doc => {
          this.events.unshift(doc.EventNaziv);
          this.events = Array.from(new Set(this.events));
        });
      });
    }
  }
  checkValue(id: string, pogledano: boolean) {
    this.itemDoc = this.prijavaService.getPrijavaValue(id);
    this.itemDoc.update({Pogledano: pogledano})
    .then(() => {
      console.log('Document successfully updated!');
    })
    .catch((error) => {
      // The document probably doesn't exist.
      console.error('Error updating document: ', error);
    });
  }
}
