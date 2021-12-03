import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../model/order';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  apiURLOrders = environment.apiURL + 'order';
  apiURLProducts = environment.apiURL + 'product';

  constructor(private http: HttpClient) { }

  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiURLOrders}/${orderId}`);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiURLOrders);
  }

  addOrders(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiURLOrders, order);
  }

  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLOrders}/${orderId}`);
  }

  updateOrder(orderStatus: { status: string }, orderId: string | undefined): Observable<Order> {
    return this.http.put<Order>(`${this.apiURLOrders}/${orderId}`, orderStatus);
  }

  ordersCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLOrders}/get/count`)
      .pipe(map((objectValue: any) => objectValue.orderCount));
  }

  totalSales(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLOrders}/get/totalsales`)
      .pipe(map((objectValue: any) => objectValue.totalsales));
  }

  getProduct(productId: string): Observable<any> {
    return this.http.get<any>(`${this.apiURLProducts}/${productId}`);
  }

  getUserOrders(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiURLOrders}/get/userorders/${userId}`);
  }
}
