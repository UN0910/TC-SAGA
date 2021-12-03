import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Category, CategoryService } from '@t.c.saga/products';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tcadmin-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryListComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private categoryService: CategoryService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this._getCategories();
  }

  ngOnDestroy() {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  editCategory(categoryId: string) {
    this.router.navigateByUrl(`categories/form/${categoryId}`);
  }

  deleteCategory(categoryId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this Category?',
      header: 'Delete Category',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoryService.deleteCategory(categoryId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
          this._getCategories();
          this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: 'Category Deleted!!!' });
        },
          () => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: "Category can't be Added!!!" });
          });
      }
    });

  }

  private _getCategories() {
    this.categoryService.getCategories().pipe(takeUntil(this.endsubs$)).subscribe((cats) => {
      this.categories = cats;
    })
  }

}
