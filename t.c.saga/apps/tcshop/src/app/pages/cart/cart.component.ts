import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CartItemDetailed, CartService, OrderService } from '@t.c.saga/orders';
import { LocalStorageService } from '@t.c.saga/user';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tcshop-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CartComponent implements OnInit, OnDestroy {

  cartItemsDetailed: CartItemDetailed[] = [];
  cartCount = 0;
  totalPrice!: number;
  endSubs$: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.getCartDetails();
    this.getOrderSummary();
  }

  ngOnDestroy() {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  private getCartDetails() {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe((respCart) => {
      this.cartItemsDetailed = [];
      this.cartCount = respCart?.items.length ?? 0;
      respCart.items.forEach((cartItem: any) => {
        this.orderService.getProduct(cartItem.productId).subscribe((respProduct) => {
          this.cartItemsDetailed.push({
            product: respProduct,
            quantity: cartItem.quantity
          });
        });
      });
    });
  }

  private getOrderSummary() {
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe((cart) => {
      this.totalPrice = 0;
      if (cart) {
        cart.items.map((item: any) => {
          this.orderService
            .getProduct(item.productId)
            .pipe(take(1))
            .subscribe((product) => {
              this.totalPrice += product.price * item.quantity;
            });
        });
      }
    });
  }

  deleteCartItem(cartItem: CartItemDetailed) {
    this.cartService.deleteCartItem(cartItem.product._id);
  }

  updateCartItemQuantity(event: any, cartItem: CartItemDetailed) {
    this.cartService.setCartItem(
      {
        productId: cartItem.product._id,
        quantity: event.value
      },
      true
    );
  }

  onCheckout() {
    if (this.totalPrice == 0) {
      return
    }
    this.router.navigate(['/checkout']);
  }

}
