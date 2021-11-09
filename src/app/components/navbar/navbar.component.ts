import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

import { NavbarService } from '../../services/navbar.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { KursService } from '../../services/kurs.service';
import { VijestiService } from '../../services/vijesti.service';

import { Kurs } from 'src/app/models/Kurs';
import { Vijest } from '../../models/Vijest';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  pretraga: '';
  kursevi: Kurs[];
  user: any;
  vijesti: Vijest[];
  sveVijesti: Vijest[];
  constructor(public nav: NavbarService,
              private authService: AuthServiceService,
              private kursService: KursService,
              private storage: AngularFireStorage,
              private vijestiService: VijestiService,
              private router: Router) { }

  ngOnInit() {
    this.vijestiService.getFocused().subscribe(vijesti => {
      this.vijesti = vijesti;
      this.vijesti.forEach(doc => {
        const ref = this.storage.ref(`Vijesti/${doc.Podnaslov}`);
        doc.Slika = ref.getDownloadURL();
        doc.Podnaslov = doc.Podnaslov.substring(0, 50) + '...';
      });
    });
    this.vijestiService.getVijesti().subscribe(vijesti => {
      this.sveVijesti = vijesti;
      this.sveVijesti.forEach(doc => {
        const ref = this.storage.ref(`Vijesti/${doc.Podnaslov}`);
        doc.Slika = ref.getDownloadURL();
        doc.Podnaslov = doc.Podnaslov.substring(0, 50) + '...';
      });
    });
    this.authService.getAuth().subscribe(user => {
      this.user = user;
    });
  }
  onSubmit(form: NgForm) {
    if (form.invalid) {
      console.log('err');
    } else {
      this.router.navigate([`/pretraga/${this.pretraga}`]);
    }
  }
}
