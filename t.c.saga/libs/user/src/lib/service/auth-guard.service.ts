import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  canActivate() {
    const token = this.localStorageService.getToken();

    if (token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      if ((tokenDecode.userRole == 'ADMIN' || tokenDecode.userRole == 'CREATOR' || tokenDecode.userRole == 'CUSTOMER') && !this.tokenExpired(tokenDecode.exp)) {
        return true
      }
    }

    this.router.navigate(['/authenticate']);
    return false;
  }

  private tokenExpired(expiration: any): boolean {
    return Math.floor(new Date().getTime() / 1000) >= expiration;
  }
}
