import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as AOS from 'aos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  cookieMessage: any = 'Ova web stranica koristi kolačiće kako bi osigurala najbolje iskustvo na našoj web stranici.';
  cookieDismiss: any = 'Shvaćam';
  cookieLinkText: any = 'Saznaj više';
  title = 'Obrazovanje-odraslih';
  ngOnInit(): void {
    AOS.init();
    const cc = window as any;
    cc.cookieconsent.initialise({
      palette: {
        popup: {
          background: '#2e2d2d'
        },
        button: {
          background: '#d9d9d9',
          text: '#164969'
        }
      },
      theme: 'classic',
      content: {
        message: this.cookieMessage,
        dismiss: this.cookieDismiss,
        link: this.cookieLinkText,
        // href: environment.Frontend + '/dataprivacy'
      }
    });
  }
}
