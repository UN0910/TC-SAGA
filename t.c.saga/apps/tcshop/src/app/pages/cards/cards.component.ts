import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CartItem, CartService } from '@t.c.saga/orders';
import { Product, ProductService } from '@t.c.saga/products';
import { LocalStorageService, UserService } from '@t.c.saga/user';
import { Wishlist, WishlistService } from '@t.c.saga/ui';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tcshop-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {

  cards: Product[] = [];
  // inWishlist = false;
  isUser = false;
  endsubs$: Subject<any> = new Subject();
  currentUserId!: string;

  constructor(
    private cardService: ProductService,
    private cartService: CartService,
    private userService: UserService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService,
    private wishlistService: WishlistService
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getCards();

    this.cartService.cart$.subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'CART',
        detail: 'CART UPDATED!!!'
      });
    });
  }

  private getCards() {
    this.cardService.getProducts().pipe(takeUntil(this.endsubs$)).subscribe(cards => {
      this.cards = cards;
    })
  }

  addToCart(cardId: string) {
    const cartItem: CartItem = {
      productId: cardId,
      quantity: 1
    };
    this.cartService.setCartItem(cartItem);
  }

  addToWishlist(productId: any) {
    // this.inWishlist = true;
    const wishlist: Wishlist = {
      product: productId,
      user: this.currentUserId
    };
    this.wishlistService.addWishlist(wishlist).pipe(takeUntil(this.endsubs$)).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: `Card Added to wishlist!!!` });
    },
      error => {
        if (error.status === 300) {
          // error = "Card already exists in the Wishlist!!!";
          return this.messageService.add({ severity: 'info', summary: 'INFO', detail: `${error.error.error}` });
        }
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: `${error.error.error}` });
      })
  }

  private getCurrentUser() {
    const token: string | any = this.localStorageService.getToken();
    if (token) {
      this.isUser = true;
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      this.currentUserId = tokenDecode.userId;
    }
  }
}
