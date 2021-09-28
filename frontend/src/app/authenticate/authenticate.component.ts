import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit {

  constructor(private router: Router, private authService: SocialAuthService) { }

  ngOnInit(): void {
  }

  onSignUp() {
    const container = document.querySelector(".container");

    container.classList.add("sign-up-mode");
  }

  onSignIn() {
    const container = document.querySelector(".container");

    container.classList.remove("sign-up-mode");
  }

  onGoogleSignIn() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((data) => {
      localStorage.setItem('google_auth', JSON.stringify(data));
      this.router.navigateByUrl('/profile').then();
    });
  }

  onFacebookSignIn() {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((data) => {
      localStorage.setItem('facebook_auth', JSON.stringify(data));
      this.router.navigateByUrl('/profile').then();
    });
  }
}
