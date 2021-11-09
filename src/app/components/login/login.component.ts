import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthServiceService } from '../../services/auth-service.service';
import { ComfirmationDialogService } from '../confirmation-dialog/comfirmation-dialog.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  constructor(public auth: AuthServiceService,
              private router: Router,
              private cds: ComfirmationDialogService) {
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn === true) {
      this.router.navigate(['/dashboard']);
    }
  }
  onSubmit() {
    this.auth.SignIn(this.email, this.password);
  }
  resetPassword() {
    this.auth.getAuth().subscribe(auth => {
      if (auth) {
        this.email = auth.email;
      }
    });
    if (!this.email) {
      this.cds.alert('', 'Unesite prvo Vaš email.');
    }
    this.auth.resetPasswordInit(this.email)
    .then(
      () => this.cds.alert('', 'Link za resetovanje pasvorda je poslan na Vašu email adresu.'),
      (rejectionReason) => this.cds.alert('', rejectionReason))
    .catch(e => this.cds.alert('', 'Desila se greška prilikom pokušaja resetovanja Vašeg pasvorda.'));
  }
}
