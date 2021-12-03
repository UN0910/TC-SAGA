import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Order, OrderService } from '@t.c.saga/orders';
import { Product, ProductService } from '@t.c.saga/products';
import { LocalStorageService, UserService } from '@t.c.saga/user';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tccreator-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {

  currentUserId!: string;
  statistics = [];
  orders: Order[] = [];
  products: Product[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getOrders();
    this.getCreatorFeaturedProducts();

    combineLatest([
      this.orderService.ordersCount(),
      this.productService.creatorProductsCount(this.currentUserId),
      this.productService.creatorFeaturedCount(this.currentUserId),
      this.orderService.totalSales()
    ]).subscribe((values: any) => {
      this.statistics = values;
    })
  }

  ngOnDestroy() {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  private getOrders() {
    this.orderService.getOrders().pipe(takeUntil(this.endsubs$)).subscribe((orders) => {
      this.orders = orders;
    })
  }

  private getCreatorFeaturedProducts() {
    this.productService.getCreatorFeaturedProducts(this.currentUserId).subscribe((products) => {
      this.products = products;
    })
  }

  private getCurrentUser() {
    const token: string | any = this.localStorageService.getToken();
    const tokenDecode = JSON.parse(atob(token.split('.')[1]));
    this.currentUserId = tokenDecode.userId;
  }

}
