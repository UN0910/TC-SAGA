import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Wishlist } from '../model/wishlist';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  apiURLWishlist = environment.apiURL + 'wishlist';

  constructor(private http: HttpClient) { }

  getWishlist(userId: string): Observable<Wishlist[]> {
    return this.http.get<Wishlist[]>(`${this.apiURLWishlist}/${userId}`);
  }

  addWishlist(wishlist: Wishlist): Observable<Wishlist> {
    return this.http.post<Wishlist>(this.apiURLWishlist, wishlist);
  }

  deleteWishlist(wishlistId: string): Observable<Wishlist> {
    return this.http.delete<Wishlist>(`${this.apiURLWishlist}/${wishlistId}`);
  }

  checkProductInWishlist(productId: string, userId: string): Observable<Wishlist> {
    return this.http.get<Wishlist>(`${this.apiURLWishlist}/${productId}/${userId}`);
  }
}
