import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';

import { KursService } from '../../services/kurs.service';
import { PrakticnaObukaService } from '../../services/prakticna-obuka.service';
import { FooterService } from '../../services/footer.service';
import { NavbarService } from '../../services/navbar.service';

import { Kurs } from '../../models/Kurs';
import { Prakticne } from '../../models/Prakticne';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-kurs',
  templateUrl: './kurs.component.html',
  styleUrls: ['./kurs.component.css']
})
export class KursComponent implements OnInit {
  datumDanas = new Date().getTime();
  datumKurs: any;
  slikaURL: string;
  bool: any;
  id: string;
  obuka: Prakticne;
  kurs: Kurs;
  slicno: Kurs[];
  nedavno: Kurs[];
  constructor(private kursService: KursService,
              private footerService: FooterService,
              private navbarService: NavbarService,
              private storage: AngularFireStorage,
              private route: ActivatedRoute,
              private obukeService: PrakticnaObukaService,
              private meta: Meta,
              private router: Router) {
               }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.footerService.show();
    this.navbarService.show();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    // provjera da li je pozvano sa obuke
    this.bool = this.route.snapshot.params.p;
    this.id = this.route.snapshot.params.id;
    if (this.bool === 'true') {
      this.obukeService.getObuka(this.id).subscribe(obuka => {
        this.kurs = obuka;
        this.datumKurs = new Date(obuka.DatumPocetka).getTime();
        const ref = this.storage.ref(`Obuke/${this.kurs.Naslov}`);
        this.kurs.Slika = ref.getDownloadURL();
        this.storage.ref('Obuke/' + this.kurs.Naslov).getDownloadURL().subscribe( slik => {
          this.meta.addTags([
            {property: 'og:image', content: slik},
            { property: 'og:url', content: `https://angular.demo.ba/kurs/${{[this.id]: this.id}}/${{[this.bool]: this.bool}}` },
            { property: 'og:type', content: 'website' },
            { property: 'og:title', content: this.kurs.Naslov},
            { property: 'og:description', content: this.kurs.Opis}
          ]);
        });
        this.obukeService.getByKategorija(this.kurs.Kategorija).subscribe(slicno => {
          this.slicno = slicno;
          this.slicno.forEach(doc => {
            // tslint:disable-next-line: no-shadowed-variable
            const ref = this.storage.ref(`Obuke/${doc.Naslov}`);
            doc.Slika = ref.getDownloadURL();
          });
          this.slicno = this.slicno.filter(obj => obj.Id !== obuka.Id);
        });
        this.obukeService.sveObuke().subscribe(nedavno => {
          this.nedavno = nedavno;
          this.nedavno = this.nedavno.filter(obj => obj.Id !== obuka.Id);
        });
      });
    } else {
      this.kursService.getKurs(this.id).subscribe(kurs => {
        this.kurs = kurs;
        console.log(kurs.DatumPocetka);
        this.datumKurs = new Date(kurs.DatumPocetka).getTime();
        console.log(this.datumKurs);
        console.log(this.datumDanas);
        const ref = this.storage.ref(`Kursevi/${this.kurs.Naslov}`);
        this.kurs.Slika = ref.getDownloadURL();
        this.storage.ref('Kursevi/' + this.kurs.Naslov).getDownloadURL().subscribe( slik => {
          this.meta.addTags([
            { property: 'og:url', content: `http://localhost:4200/kurs/${this.id}/${this.bool}`},
            { property: 'og:image', content: slik},
            { property: 'og:type', content: 'website' },
            { property: 'og:title', content: this.kurs.Naslov},
            { property: 'og:description', content: this.kurs.Opis}
          ]);
        });
        this.kursService.getByKategorija(this.kurs.Kategorija).subscribe(slicno => {
          this.slicno = slicno;
          this.slicno.forEach(doc => {
            // tslint:disable-next-line: no-shadowed-variable
            const ref = this.storage.ref(`Kursevi/${doc.Naslov}`);
            doc.Slika = ref.getDownloadURL();
          });
          this.slicno = this.slicno.filter(obj => obj.Id !== kurs.Id);
        });
        this.kursService.sviKursevi().subscribe(nedavno => {
          this.nedavno = nedavno;
          console.log(this.nedavno);
          this.nedavno = this.nedavno.filter(obj => obj.Id !== kurs.Id);
          console.log(this.nedavno);
        });
      });
    }
      // tslint:disable-next-line: max-line-length
    document.getElementById('shareFB').setAttribute('data-href', encodeURIComponent(document.URL));
      // tslint:disable-next-line: max-line-length
    document.getElementById('shareFBLink').setAttribute('href', 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(document.URL));
  }
  loadOnce() {
    window.location.reload();
  }
  async getImgFromServer(imgName: string): Promise<string> {
    let img;
    img = this.storage.ref('Obuke/' + imgName).getDownloadURL();
    const downloadURL = await img.getDownloadURL();
    return downloadURL;
}
}
