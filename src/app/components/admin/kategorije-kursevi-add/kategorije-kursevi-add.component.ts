import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { KategorijaKurs } from '../../../models/KategorijaKurs';
import { KategorijeKurseviService } from '../../../services/kategorije-kursevi.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-kategorije-kursevi-add',
  templateUrl: './kategorije-kursevi-add.component.html',
  styleUrls: ['./kategorije-kursevi-add.component.css']
})
export class KategorijeKurseviAddComponent implements OnInit {
  kategorija: KategorijaKurs = {
    Naziv: ''
  };
  constructor(private kategorijeKurseviService: KategorijeKurseviService,
              private fm: FlashMessagesService,
              private router: Router) { }

  ngOnInit(): void {
  }
  onSubmit({value, valid}: {value: KategorijaKurs, valid: boolean}) {
    if (!valid) {
      console.log(value);
    } else {
      this.kategorijeKurseviService.addkategorijaKurs(this.kategorija);
      this.fm.show('Nova kategorija je uspješno dodana', { cssClass: 'alert-success', timeout: 3000 });
      this.router.navigate([`dashboard/kategorije-kursevi`]);
    }
  }
}
