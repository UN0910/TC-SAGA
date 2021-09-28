import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public userDetails;

  constructor(private router: Router) { }

  ngOnInit(): void {
    const storage = localStorage.getItem('google_auth');
    const storage2 = localStorage.getItem('facebook_auth');

    if (storage) {
      this.userDetails = JSON.parse(storage);
    } else if (storage2) {
      this.userDetails = JSON.parse(storage2);
    } else {
      this.signOut();
    }
  }

  signOut(): void {
    localStorage.removeItem('google_auth');
    localStorage.removeItem('facebook_auth');
    this.router.navigateByUrl('/authenticate').then();
  }

}
