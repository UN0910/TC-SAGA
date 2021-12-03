import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from './service/cart.service';

@NgModule({
  imports: [CommonModule],
})
export class OrdersModule {
  constructor(
    cartService: CartService
  ) {
    cartService.initCartLocalStorage();
  }
}
