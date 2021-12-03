import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticateService } from '@t.c.saga/user';

@Component({
  selector: 'tccreator-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None
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
