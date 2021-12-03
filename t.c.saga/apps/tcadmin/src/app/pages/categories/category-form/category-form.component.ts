import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Category, CategoryService } from '@t.c.saga/products';
import { MessageService } from 'primeng/api';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tcadmin-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isSubmitted = false;
  editMode = false;
  currentCategoryId!: string;
  endsubs$: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      color: ['#000000']
    })

    this.checkEditMode();
  }

  ngOnDestroy() {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  onCancel() {
    this.location.back();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return
    }
    const category: Category = {
      _id: this.currentCategoryId,
      name: this.form.controls.name.value,
      icon: this.form.controls.icon.value,
      color: this.form.controls.color.value
    };

    if (this.editMode) {
      this.updateCategory(category)
    } else {
      this.addCategory(category)
    }
  }

  private addCategory(category: Category) {
    this.categoryService.addCategories(category).pipe(takeUntil(this.endsubs$)).subscribe((category: Category) => {
      this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: `Category ${category.name} Added!!!` });
    },
      () => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Category Not Added!!!' });
      });
    timer(2000).toPromise().then(() => {
      this.location.back();
    })
  }

  private updateCategory(category: Category) {
    this.categoryService.updateCategories(category).pipe(takeUntil(this.endsubs$)).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: 'Category Updated!!!' });
    },
      () => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Category Not Updated!!!' });
      });
    timer(2000).toPromise().then(() => {
      this.location.back();
    })
  }

  private checkEditMode() {
    this.route.params.subscribe(params => {
      if (params.id) {
        this.editMode = true;
        this.currentCategoryId = params.id;
        this.categoryService.getCategory(params.id).pipe(takeUntil(this.endsubs$)).subscribe(category => {
          this.form.controls.name.setValue(category.name);
          this.form.controls.icon.setValue(category.icon);
          this.form.controls.color.setValue(category.color);
        })
      }
    })
  }
}
