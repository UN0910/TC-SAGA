import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiURLProducts = environment.apiURL + 'product';

  constructor(private http: HttpClient) { }

  getProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiURLProducts}/${productId}`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiURLProducts);
  }

  getCreatorProducts(creatorId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiURLProducts}/creator/${creatorId}`);
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiURLProducts}/get/featured`);
  }

  getCreatorFeaturedProducts(creatorId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiURLProducts}/get/creator/featured/${creatorId}`);
  }

  addProducts(productData: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiURLProducts, productData);
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLProducts}/${productId}`);
  }

  updateProducts(productData: FormData, productId: string): Observable<Product> {
    return this.http.put<Product>(`${this.apiURLProducts}/${productId}`, productData);
  }

  productsCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLProducts}/get/count`)
      .pipe(map((objectValue: any) => objectValue.productCount));
  }

  creatorProductsCount(creatorId: string): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLProducts}/get/creator/count/${creatorId}`)
      .pipe(map((objectValue: any) => objectValue.productCount));
  }

  creatorFeaturedCount(creatorId: string): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLProducts}/get/creator/featured/count/${creatorId}`)
      .pipe(map((objectValue: any) => objectValue.productCount));
  }

  featuredProducts(count: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiURLProducts}/get/featured/${count}`);
  }
}
