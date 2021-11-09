import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-topbar',
  templateUrl: './admin-topbar.component.html',
  styleUrls: ['./admin-topbar.component.css']
})
export class AdminTopbarComponent implements OnInit {
  email: string;
  constructor() { }

  ngOnInit(): void {
  }
  onLogoutClick() {}
  resetPassword() {}
}
