import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { KategorijeVijestiService } from '../../../services/kategorije-vijesti.service';
import { KategorijaVijesti } from '../../../models/KategorijaVijesti';
import { FlashMessagesService } from 'angular2-flash-messages';
import { VijestiService } from '../../../services/vijesti.service';

@Component({
  selector: 'app-kategorije-vijesti-izmjena',
  templateUrl: './kategorije-vijesti-izmjena.component.html',
  styleUrls: ['./kategorije-vijesti-izmjena.component.css']
})
export class KategorijeVijestiIzmjenaComponent implements OnInit {
  stara: string;
  id: string;
  category: string;
  kategorija: KategorijaVijesti = {
    Naziv: ''
  };
  constructor(private router: Router,
              private route: ActivatedRoute,
              private kategorijeService: KategorijeVijestiService,
              private fm: FlashMessagesService,
              private vijestiService: VijestiService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.kategorijeService.getKategorijaVijesti(this.id).subscribe(kategorija => {
      this.kategorija = kategorija;
      this.stara = kategorija.Naziv;
    });
  }
  onSubmit({value, valid}: {value: KategorijaVijesti, valid: boolean}) {
    if (!valid) {
      console.log(valid);
    } else {
        this.kategorijeService.updateKategorijaVijesti(value, this.id);
        this.vijestiService.getByKategorija(this.stara).forEach(values => {
          values.forEach(doc => {
            this.vijestiService.updateKategorija(doc, this.kategorija.Naziv);
          });
        });
        this.fm.show('Kategorija je uspješno izmijenjena', { cssClass: 'alert-success', timeout: 3000 });
        this.router.navigate([`/dashboard/kategorije-vijesti`]);
    }
  }
}
