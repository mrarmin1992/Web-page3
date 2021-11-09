import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-korisnici-usluga',
  templateUrl: './korisnici-usluga.component.html',
  styleUrls: ['./korisnici-usluga.component.css']
})
export class KorisniciUslugaComponent implements OnInit {
  pretraga: '';
  constructor(private router: Router) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
  onSubmit(form: NgForm) {
    if (form.invalid) {
      console.log('err');
    } else {
      this.router.navigate([`/pretraga/${this.pretraga}`]);
    }
  }
}
