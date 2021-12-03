import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '@t.c.saga/user';
import { Product, ProductService } from '@t.c.saga/products';
import { Order, OrderService } from '@t.c.saga/orders';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tcadmin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {

  statistics = [];
  orders: Order[] = [];
  products: Product[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.getOrders();
    this.getFeaturedProducts();

    combineLatest([
      this.orderService.ordersCount(),
      this.productService.productsCount(),
      this.userService.getUsersCount(),
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

  private getFeaturedProducts() {
    this.productService.getFeaturedProducts().pipe(takeUntil(this.endsubs$)).subscribe((products) => {
      this.products = products;
    })
  }
}
