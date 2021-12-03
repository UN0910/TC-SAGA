import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LocalStorageService } from '@t.c.saga/user';
import { CartService } from '@t.c.saga/orders';
import { Router } from '@angular/router';

@Component({
  selector: 'tcshop-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {

  isUser = false;
  cartCount!: number | 0;

  constructor(
    private localStorageService: LocalStorageService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.cartService.cart$.subscribe((cart) => {
      this.cartCount = cart?.items?.length ?? 0;
    });
  }

  private getCurrentUser() {
    const token = this.localStorageService.getToken();

    if (token) {
      this.isUser = true;
    }
  }

  onLogout() {
    this.localStorageService.removeToken();
    this.router.navigate(['/']);
  }

  searchOpen() {
    const navbar: Element | any = document.querySelector(".navbar");

    navbar.classList.toggle("showInput");
  }

  menuOpen() {
    const navLinks: Element | any = document.querySelector(".nav-links");

    navLinks.style.left = "0";
  }
  menuClose() {
    const navLinks: Element | any = document.querySelector(".nav-links");

    navLinks.style.left = "-100%";
  }
}
