import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '@t.c.saga/user';

@Component({
  selector: 'tcadmin-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(
    private authService: AuthenticateService
  ) { }

  ngOnInit(): void {
  }

  onLogout() {
    this.authService.logout();
  }
}
