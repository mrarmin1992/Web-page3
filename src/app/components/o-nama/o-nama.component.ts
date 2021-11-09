import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-o-nama',
  templateUrl: './o-nama.component.html',
  styleUrls: ['./o-nama.component.css']
})
export class ONamaComponent implements OnInit {

  constructor(private meta: Meta) {
    this.meta.addTags([
      { property: 'og:url', content: `https://angular.demo.ba/vijesti`},
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Test'},
      { property: 'og:description', content: 'Test'}
    ]);
   }

  ngOnInit() {
  }

}
