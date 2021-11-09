import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { Meta } from '@angular/platform-browser';

import { DogadjajiService } from '../../services/dogadjaji.service';
import { NavbarService } from '../../services/navbar.service';
import { FooterService } from '../../services/footer.service';

import { Dogadjaj } from '../../models/Dogadjaj';

@Component({
  selector: 'app-dogadjaj',
  templateUrl: './dogadjaj.component.html',
  styleUrls: ['./dogadjaj.component.css']
})
export class DogadjajComponent implements OnInit {
  id: any;
  dogadjaj: Dogadjaj;
  slicno: Dogadjaj[];
  nedavno: Dogadjaj[];
  constructor(private dogadjajiService: DogadjajiService,
              private route: ActivatedRoute,
              private storage: AngularFireStorage,
              private navbar: NavbarService,
              private footer: FooterService,
              private meta: Meta,
              private router: Router) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.navbar.show();
    this.footer.show();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.id = this.route.snapshot.params.id;
    // tslint:disable-next-line: deprecation
    this.dogadjajiService.getDogadjaj(this.id).subscribe(dogadjaj => {
      this.dogadjaj = dogadjaj;
      const ref = this.storage.ref(`Dogadjaji/${dogadjaj.Naslov}`);
      this.dogadjaj.Slika = ref.getDownloadURL();
      this.storage.ref('Dogadjaji/' + this.dogadjaj.Naslov).getDownloadURL().subscribe(slik => {
        this.meta.addTags([
          { property: 'og:image', content: slik},
          { property: 'og:url', content: `https://angular.demo.ba/dogadjaj/${this.dogadjaj.Id}`},
          { property: 'og:type', content: 'website' },
          { property: 'og:title', content: this.dogadjaj.Naslov},
          { property: 'og:description', content: jQuery(this.dogadjaj.Opis).text()}
        ]);
    });
      // tslint:disable-next-line: max-line-length
      document.getElementById('shareFB').setAttribute('data-href', encodeURIComponent(document.URL));
      // tslint:disable-next-line: max-line-length
      document.getElementById('shareFBLink').setAttribute('href', 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(document.URL));
    });
    this.dogadjajiService.sviDogadjaji().subscribe(nedavno => {
      this.nedavno = nedavno;
      console.log(this.nedavno);
    });
    this.dogadjajiService.sviDogadjaji().subscribe(slicno => {
      this.slicno = slicno;
      this.slicno.forEach(doc => {
        // tslint:disable-next-line: no-shadowed-variable
        const ref = this.storage.ref(`Dogadjaji/${doc.Naslov}`);
        doc.Slika = ref.getDownloadURL();
      });
    });
  }
}
