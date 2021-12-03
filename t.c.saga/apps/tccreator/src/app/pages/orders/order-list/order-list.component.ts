import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrderService } from '@t.c.saga/orders';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tccreator-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private orderService: OrderService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getOrders();
  }

  ngOnDestroy() {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  showOrder(orderId: string) {
    this.router.navigateByUrl(`orders/${orderId}`);
  }

  deleteOrder(orderId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this Order?',
      header: 'Delete Order',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.orderService.deleteOrder(orderId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
          this.getOrders();
          this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: 'Order Deleted!!!' });
        },
          () => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: "Order can't be Added!!!" });
          });
      }
    });

  }

  private getOrders() {
    this.orderService.getOrders().pipe(takeUntil(this.endsubs$)).subscribe((orders) => {
      this.orders = orders;
    })
  }

}
