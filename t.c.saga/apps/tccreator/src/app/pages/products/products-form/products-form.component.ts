import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Category, CategoryService, Product, ProductService } from '@t.c.saga/products';
import { MessageService } from 'primeng/api';
import { Subject, timer } from 'rxjs';
import { Location } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { LocalStorageService } from '@t.c.saga/user';

@Component({
  selector: 'tccreator-products-form',
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductsFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isSubmitted = false;
  editMode = false;
  currentProductId!: string;
  currentUserId!: string;
  categories: Category[] = [];
  imageDisplay!: string | ArrayBuffer | null;
  imageDisplay2: string | undefined;
  endsubs$: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private messageService: MessageService,
    private categoryService: CategoryService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();

    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      detailDescription: [''],
      image: ['', Validators.required],
      price: ['', Validators.required],
      postedBy: [this.currentUserId, Validators.required],
      category: ['', Validators.required],
      isFeatured: [false],
    })

    this.checkEditMode();
    this.getCategories();
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

    const productFormData = new FormData();
    Object.keys(this.form.controls).map((key) => {
      productFormData.append(key, this.form.controls[key].value);
    })

    if (this.editMode) {
      this.updateProduct(productFormData)
    } else {
      this.addProduct(productFormData)
    }
  }

  private addProduct(productData: FormData) {
    this.productService.addProducts(productData).pipe(takeUntil(this.endsubs$)).subscribe((product: Product) => {
      this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: `Product ${product.name} Added!!!` });
    },
      () => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Product Not Added!!!' });
      });
    timer(2000).toPromise().then(() => {
      this.location.back();
    })
  }

  private updateProduct(productData: FormData) {
    this.productService.updateProducts(productData, this.currentProductId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: 'Product Updated!!!' });
    },
      () => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Product Not Updated!!!' });
      });
    timer(2000).toPromise().then(() => {
      this.location.back();
    })
  }

  private checkEditMode() {
    this.route.params.pipe(takeUntil(this.endsubs$)).subscribe(params => {
      if (params.id) {
        this.editMode = true;
        this.currentProductId = params.id;
        this.productService.getProduct(params.id).subscribe(product => {
          this.form.controls.name.setValue(product.name);
          this.form.controls.price.setValue(product.price);
          this.form.controls.postedBy.setValue(product.postedBy?.userName);
          this.form.controls.category.setValue(product.category?._id);
          this.form.controls.isFeatured.setValue(product.isFeatured);
          this.form.controls.description.setValue(product.description);
          this.form.controls.detailDescription.setValue(product.detailDescription);
          this.imageDisplay2 = product.image;
          this.form.controls.image.setValidators([]);
          this.form.controls.image.updateValueAndValidity();
        })
      }
    })
  }

  private getCategories() {
    this.categoryService.getCategories().pipe(takeUntil(this.endsubs$)).subscribe(categories => {
      this.categories = categories;
    })
  }

  onImageUpload(event: any) {

    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ image: file });
      this.form.get('image')?.updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result;
      }
      fileReader.readAsDataURL(file);
    }
  }

  private getCurrentUser() {
    const token: string | any = this.localStorageService.getToken();
    const tokenDecode = JSON.parse(atob(token.split('.')[1]));
    this.currentUserId = tokenDecode.userId;
  }
}
