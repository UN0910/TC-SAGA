import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem, CartService, Order, OrderService } from '@t.c.saga/orders';
import { LocalStorageService, User, UserService } from '@t.c.saga/user';
import { Wishlist, WishlistService } from '@t.c.saga/ui';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tcshop-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit, OnDestroy {
  accountForm!: FormGroup;
  addressForm!: FormGroup;
  username!: string | any;
  isAccountForm = false;
  isAddressForm = false;
  myOrders = false;
  isWishlist = false;
  isSubmitted = false;
  orders: Order[] = [];
  wishlists: Wishlist[] = [];
  countries: { id: string; name: string; }[] = [];
  user!: User;
  currentUserId!: string;
  endsubs$: Subject<any> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService,
    private orderService: OrderService,
    private confirmationService: ConfirmationService,
    private cartService: CartService,
    private router: Router,
    private wishlistService: WishlistService
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();

    this.accountForm = this.formBuilder.group({
      userName: [this.user.userName, Validators.required],
      email: [this.user.email, Validators.required],
      password: [''],
      phone: [this.user.phone],
    })

    this.addressForm = this.formBuilder.group({
      street: [this.user.street],
      apartment: [this.user.apartment],
      city: [this.user.city],
      country: [this.user.country],
      pincode: [this.user.pincode]
    })

    this.getCountries();
  }

  ngOnDestroy() {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.accountForm.invalid && this.addressForm.invalid) {
      return
    }
    const user: User = {
      _id: this.currentUserId,
      userName: this.accountForm.controls.userName.value,
      email: this.accountForm.controls.email.value,
      password: this.accountForm.controls.password.value,
      phone: this.accountForm.controls.phone.value,
      street: this.addressForm.controls.street.value,
      apartment: this.addressForm.controls.apartment.value,
      city: this.addressForm.controls.city.value,
      pincode: this.addressForm.controls.pincode.value,
      country: this.addressForm.controls.country.value,
    }

    this.updateUser(user);
  }

  private updateUser(user: User) {
    this.userService.updateUsers(user).pipe(takeUntil(this.endsubs$)).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: 'Profile Updated!!!' });
    },
      () => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Profile Not Updated!!!' });
      });
  }

  private getCurrentUser() {
    const token: string | any = this.localStorageService.getToken();
    const tokenDecode = JSON.parse(atob(token.split('.')[1]));
    this.user = tokenDecode.user;
    this.username = tokenDecode.user.userName;
    this.currentUserId = tokenDecode.userId;
  }

  private getCountries() {
    this.countries = this.userService.getCountries();
  }

  onAccountForm() {
    this.isAccountForm = true;
    this.isAddressForm = false;
    this.myOrders = false;
    this.isWishlist = false;
  }

  onAddressForm() {
    this.isAddressForm = true;
    this.isAccountForm = false;
    this.myOrders = false;
    this.isWishlist = false;
  }

  onMyOrders() {
    this.myOrders = true;
    this.isAddressForm = false;
    this.isAccountForm = false;
    this.isWishlist = false;
    this.getUserOrders();
  }

  onWishlist() {
    this.isWishlist = true;
    this.myOrders = false;
    this.isAddressForm = false;
    this.isAccountForm = false;
    this.getWishlist();
  }

  private getUserOrders() {
    this.orderService.getUserOrders(this.currentUserId).pipe(takeUntil(this.endsubs$)).subscribe((orders) => {
      this.orders = orders;
    })
  }

  cancelOrder(orderId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to Cancel this Order?',
      header: 'Cancel Order',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.orderService.deleteOrder(orderId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
          this.getUserOrders();
          this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: 'Order Cancelled!!!' });
        },
          () => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: "Order can't be Cancelled!!!" });
          });
      }
    });
  }

  removeProduct(wishlistId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to remove this Product from the wishlist?',
      header: 'Remove Product',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.wishlistService.deleteWishlist(wishlistId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
          this.getWishlist();
          this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: 'Item Deleted from Wishlist!!!' });
        },
          () => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: "Item can't Deleted from Wishlist!!!" });
          });
      }
    });
  }

  private getWishlist() {
    this.wishlistService.getWishlist(this.currentUserId).pipe(takeUntil(this.endsubs$)).subscribe((wishlist) => {
      this.wishlists = wishlist;
    })
  }

  addToCart(cardId: string, wishlistId: string) {
    const cartItem: CartItem = {
      productId: cardId,
      quantity: 1
    };
    this.cartService.setCartItem(cartItem);
    this.removeProduct(wishlistId);
  }

  onLogout() {
    this.localStorageService.removeToken();
    this.router.navigate(['/']);
  }
}
