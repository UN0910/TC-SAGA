import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../model/category';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  apiURLCategories = environment.apiURL + 'category';

  constructor(private http: HttpClient) { }

  getCategory(categoryId: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiURLCategories}/${categoryId}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiURLCategories);
  }

  addCategories(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiURLCategories, category);
  }

  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLCategories}/${categoryId}`);
  }

  updateCategories(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiURLCategories}/${category._id}`, category);
  }
}
