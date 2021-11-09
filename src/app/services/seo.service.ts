import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { title } from 'process';

@Injectable()
export class SeoService {

  constructor(private meta: Meta) { }

  generateTags(config) {
    // default values
    config = {
      title: 'Angular <3 Linkbots',
      description: 'My SEO friendly Angular Component',
      image: 'https://angularfirebase.com/images/logo.png',
      slug: '',
      ...config
    };
    this.meta.addTag({ property: 'og:type', content: 'article' });
    this.meta.addTag({ property: 'og:site_name', content: 'Lokalno partnerstvo' });
    this.meta.addTag({ property: 'og:title', content: config.title });
    this.meta.addTag({ property: 'og:description', content: config.description });
    this.meta.addTag({ property: 'og:image', content: config.image });
    this.meta.addTag({ property: 'og:url', content: `https://angular.demo.ba/${config.slug}` });
  }

}
