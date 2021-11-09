import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { KategorijaVijesti } from '../../../models/KategorijaVijesti';
import { KategorijeVijestiService } from '../../../services/kategorije-vijesti.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-kategorije-vijesti-add',
  templateUrl: './kategorije-vijesti-add.component.html',
  styleUrls: ['./kategorije-vijesti-add.component.css']
})
export class KategorijeVijestiAddComponent implements OnInit {

  kategorija: KategorijaVijesti = {
    Naziv: ''
  };
  constructor(private kategorije: KategorijeVijestiService,
              private router: Router,
              private fm: FlashMessagesService) { }

  ngOnInit(): void {
  }
  onSubmit({value, valid}: {value: KategorijaVijesti, valid: boolean}) {
    if (!valid) {
      console.log(value);
    } else {
      this.kategorije.addkategorijaVijesti(this.kategorija);
      this.fm.show('Nova kategorija je uspješno dodana', { cssClass: 'alert-success', timeout: 3000 });
      this.router.navigate([`dashboard/kategorije-vijesti`]);
    }
  }
}
