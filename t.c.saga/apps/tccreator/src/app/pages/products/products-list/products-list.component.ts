import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductService } from '@t.c.saga/products';
import { LocalStorageService } from '@t.c.saga/user';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tccreator-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsListComponent implements OnInit, OnDestroy {

  currentUserId!: string;
  products: Product[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private productService: ProductService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getCreatorProducts();
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
          this.getCreatorProducts();
          this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: 'Product Deleted!!!' });
        },
          () => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: "Product can't be Added!!!" });
          });
      }
    });
  }

  private getCreatorProducts() {
    this.productService.getCreatorProducts(this.currentUserId).pipe(takeUntil(this.endsubs$)).subscribe((prods) => {
      this.products = prods;
    })
  }

  private getCurrentUser() {
    const token: string | any = this.localStorageService.getToken();
    const tokenDecode = JSON.parse(atob(token.split('.')[1]));
    this.currentUserId = tokenDecode.userId;
  }

}
