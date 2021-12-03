import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrderService } from '@t.c.saga/orders';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Status {
  name: string,
  id: string
}

@Component({
  selector: 'tccreator-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  order!: Order;
  status: Status[] = [];
  selectedStatus: any;
  endsubs$: Subject<any> = new Subject();

  constructor(
    private orderService: OrderService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {
    this.status = [
      { name: 'PENDING', id: 'PENDING' },
      { name: 'DELIVERED', id: 'DELIVERED' },
      { name: 'PROCESSED', id: 'PROCESSED' },
      { name: 'SHIPPED', id: 'SHIPPED' },
      { name: 'FAILED', id: 'FAILED' },
    ];
  }

  ngOnInit(): void {
    this.getOrder();
  }

  ngOnDestroy() {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  private getOrder() {
    this.route.params.pipe(takeUntil(this.endsubs$)).subscribe(params => {
      if (params.id) {
        this.orderService.getOrder(params.id).subscribe(order => {
          this.order = order;
          this.selectedStatus = order.status;
        })
      }
    });
  }

  onStatusChange(event: any) {
    this.orderService.updateOrder({ status: event.value }, this.order._id).pipe(takeUntil(this.endsubs$)).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: 'Order Updated!!!' });
    },
      () => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Order Not Updated!!!' });
      });
  }
}
