import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductService } from '@t.c.saga/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tcadmin-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private productService: ProductService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this._getProducts();
  }

  ngOnDestroy() {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  editProduct(productId: string) {
    this.router.navigateByUrl(`products/form/${productId}`);
  }

  deleteProduct(productId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this Product?',
      header: 'Delete Product',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteProduct(productId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
          this._getProducts();
          this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: 'Product Deleted!!!' });
        },
          () => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: "Product can't be Added!!!" });
          });
      }
    });
  }

  private _getProducts() {
    this.productService.getProducts().pipe(takeUntil(this.endsubs$)).subscribe((prods) => {
      this.products = prods;
    })
  }

}
