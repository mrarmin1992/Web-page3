import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SeoService } from '../../services/seo.service';

import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, Router, NavigationStart} from '@angular/router';

import { VijestiService } from '../../services/vijesti.service';
import { FooterService } from '../../services/footer.service';
import { NavbarService } from '../../services/navbar.service';

import { Vijest } from '../../models/Vijest';

@Component({
  selector: 'app-vijest',
  templateUrl: './vijest.component.html',
  styleUrls: ['./vijest.component.css']
})
export class VijestComponent implements OnInit {
  id: any;
  vijest: Vijest;
  slicno: Vijest[];
  nedavno: Vijest[];
  constructor(private vijestiService: VijestiService,
              private storage: AngularFireStorage,
              private meta: Meta,
              private activatedRoute: ActivatedRoute,
              private footer: FooterService,
              private navbar: NavbarService,
              private router: Router,
              private seo: SeoService) {
              }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.footer.show();
    this.navbar.show();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.id = this.activatedRoute.snapshot.params.id;
    this.vijestiService.getVijest('vijesti', this.id).subscribe(vijest => {
      this.vijest = vijest;
      const ref = this.storage.ref(`Vijesti/${this.vijest.Podnaslov}`);
      this.vijest.Slika = ref.getDownloadURL();
      // tslint:disable-next-line: max-line-length
      // document.getElementById('shareFB').setAttribute('data-href', encodeURIComponent(document.URL));
      // tslint:disable-next-line: max-line-length
      // document.getElementById('shareFBLink').setAttribute('href', 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(document.URL));
      this.vijestiService.getByKategorija(vijest.Kategorija).subscribe(slicno => {
        this.slicno = slicno;
        this.slicno.forEach(doc => {
          // tslint:disable-next-line: no-shadowed-variable
          const ref = this.storage.ref(`Vijesti/${doc.Podnaslov}`);
          doc.Slika = ref.getDownloadURL();
        });
        this.slicno = this.slicno.filter(obj => obj.Id !== vijest.Id);
      });
      this.storage.ref('Vijesti/' + this.vijest.Podnaslov).getDownloadURL().subscribe(slik => {
        this.seo.generateTags({
          title: this.vijest.Naslov,
          description: jQuery(this.vijest.Sadrzaj).text(),
          image: slik,
          slug: `vijest/${this.vijest.Id}`
        });
      });
    });
    this.vijestiService.getVijesti().subscribe(nedavno => {
      this.nedavno = nedavno;
      this.nedavno.forEach(doc => {
        // tslint:disable-next-line: no-shadowed-variable
        const ref = this.storage.ref(`Vijesti/${doc.Podnaslov}`);
        doc.Slika = ref.getDownloadURL();
      });
    });
  }
}
