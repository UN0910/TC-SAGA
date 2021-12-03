import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Cart, CartService, Order, OrderItem, OrderService } from '@t.c.saga/orders';
import { LocalStorageService, User, UserService } from '@t.c.saga/user';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tcshop-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  form!: FormGroup;
  isSubmitted = false;
  orderItems: OrderItem[] = [];
  user!: User;
  totalPrice!: number;
  endSubs$: Subject<any> = new Subject();
  countries: { id: string; name: string; }[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private localStorageService: LocalStorageService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getCartItems();
    this.getOrderSummary();
    this.getCountries();
    this.initCheckoutForm();
  }

  ngOnDestroy() {
    this.endSubs$.next();
    this.endSubs$.complete();
  }

  private initCheckoutForm() {
    this.form = this.formBuilder.group({
      name: [this.user?.userName, Validators.required],
      email: [this.user?.email, [Validators.email, Validators.required]],
      phone: [this.user?.phone, Validators.required],
      city: [this.user?.city, Validators.required],
      country: [this.user?.country, Validators.required],
      pincode: [this.user?.pincode, Validators.required],
      apartment: [this.user?.apartment, Validators.required],
      street: [this.user?.street, Validators.required]
    });
  }

  private getCartItems() {
    const cart: Cart = this.cartService.getCart();
    this.orderItems = cart.items.map((item: any) => {
      return {
        product: item.productId,
        quantity: item.quantity
      };
    });
  }

  private getCountries() {
    this.countries = this.userService.getCountries();
  }

  placeOrder() {
    this.isSubmitted = true;
    if (this.form.controls.invalid) {
      return;
    }

    const order: Order = {
      orderItems: this.orderItems,
      shippingAddress1: this.form.controls.street.value,
      shippingAddress2: this.form.controls.apartment.value,
      city: this.form.controls.city.value,
      pincode: this.form.controls.pincode.value,
      country: this.form.controls.country.value,
      phone: this.form.controls.phone.value,
      status: 'PENDING',
      user: this.user._id,
      dateOrdered: `${Date.now()}`
    };

    this.orderService.addOrders(order).subscribe(
      () => {
        this.cartService.emptyCart();
        this.messageService.add({ severity: 'success', summary: 'Order', detail: 'ORDER PLACED' });
        this.router.navigate(['/thank-you']);
      },
      () => {
        //display some message to user
        this.messageService.add({ severity: 'danger', summary: 'Order', detail: "ORDER CAN'T BE PLACED" });
      }
    );
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

  private getCurrentUser() {
    const token: string | any = this.localStorageService.getToken();
    const tokenDecode = JSON.parse(atob(token.split('.')[1]));
    this.user = tokenDecode.user;
  }
}
