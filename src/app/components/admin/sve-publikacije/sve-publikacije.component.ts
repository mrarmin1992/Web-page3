import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

import { PublikacijeService } from '../../../services/publikacije.service';
import { ComfirmationDialogService } from '../../confirmation-dialog/comfirmation-dialog.service';
import { FlashMessagesService } from 'angular2-flash-messages';

import { Publikacija } from '../../../models/Publikacija';

@Component({
  selector: 'app-sve-publikacije',
  templateUrl: './sve-publikacije.component.html',
  styleUrls: ['./sve-publikacije.component.css']
})
export class SvePublikacijeComponent implements OnInit {
  autori: string[] = [];
  nazivFajla: any;
  publikacije: Publikacija[];
  filter: Publikacija[] = [];
  selectedObj = 'Autori';
  pretraga: string;
  constructor(private publikacijeService: PublikacijeService,
              private storage: AngularFireStorage,
              private fm: FlashMessagesService,
              private cds: ComfirmationDialogService) { }

  ngOnInit(): void {
    this.publikacijeService.getPublikacije().subscribe( publikacije => {
      this.publikacije = publikacije;
      this.publikacije.forEach(doc => {
        const path = `${doc.Path}`;
        this.nazivFajla = doc.Path.split('/');
        const ref = this.storage.ref(path);
        ref.getDownloadURL().subscribe( url => {
          if (url) {
            doc.Url = url;
          }
        });
        this.autori.unshift(doc.Autor);
        this.autori = Array.from(new Set(this.autori));
      });
    });
  }
  onChange() {
    this.publikacijeService.getByAutor(this.selectedObj).subscribe(publikacije => {
      this.publikacije = publikacije;
    });
  }
  pretrazi() {
    if (this.pretraga === '') {this.publikacijeService.getPublikacije().subscribe(publikacije => {
      this.publikacije = publikacije;
      this.publikacije.forEach(doc => {
        const path = `${doc.Path}`;
        this.nazivFajla = doc.Path.split('/');
        const ref = this.storage.ref(path);
        ref.getDownloadURL().subscribe( url => {
          if (url) {
            doc.Url = url;
          }
        });
        this.autori.unshift(doc.Autor);
        this.autori = Array.from(new Set(this.autori));
      });
    }); } else {
      this.publikacijeService.getPublikacije().subscribe(publikacije => {
        this.publikacije = publikacije;
        // tslint:disable-next-line: max-line-length
        this.filter = this.publikacije.filter((publikacija: Publikacija) => publikacija.Naziv.toLowerCase().includes(this.pretraga.toLowerCase()));
        this.publikacije = this.filter;
        this.publikacije.forEach(doc => {
          const path = `${doc.Path}`;
          this.nazivFajla = doc.Path.split('/');
          const ref = this.storage.ref(path);
          ref.getDownloadURL().subscribe( url => {
            if (url) {
              doc.Url = url;
            }
          });
          this.autori.unshift(doc.Autor);
          this.autori = Array.from(new Set(this.autori));
        });
      });
    }
  }
  delete(publikacija: Publikacija) {
    this.cds.confirm('Pažnja', `Jeste li sigurni da želite obrisati publikaciju ${publikacija.Naziv} ?`)
    .then(confirmed => {
      if (confirmed === false) {
        const ref = this.storage.ref(publikacija.Path);
        ref.delete();
        this.publikacijeService.deletePublikacija(publikacija);
        this.fm.show('Publikacija je uspješno obrisana', {cssClass: 'alert-success', timeout: 3000});
      }
    });
  }
}
