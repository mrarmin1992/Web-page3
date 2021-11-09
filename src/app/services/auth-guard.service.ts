import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private afAuth: AngularFireAuth) {}

  canActivate(): Observable<boolean> | boolean {
    if (localStorage.getItem('isLoggedIn') === 'true') {return true;
    } else {
      this.router.navigate(['/login']);
      return false; }
  }
}
