import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import * as countryLibrary from 'i18n-iso-countries';
declare const require: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiURLUsers = environment.apiURL + 'user';
  apiURLWishlist = environment.apiURL + 'wishlist';

  constructor(private http: HttpClient) {
    countryLibrary.registerLocale(require('i18n-iso-countries/langs/en.json'));
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiURLUsers}/${userId}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURLUsers);
  }

  getAdmins(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiURLUsers}/admin`);
  }

  getCreators(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiURLUsers}/creator`);
  }

  addUsers(user: User): Observable<User> {
    return this.http.post<User>(this.apiURLUsers, user);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLUsers}/${userId}`);
  }

  updateUsers(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiURLUsers}/${user._id}`, user);
  }

  getUsersCount(): Observable<number> {
    return this.http
      .get<number>(`${this.apiURLUsers}/get/count`)
      .pipe(map((objectValue: any) => objectValue.userCount));
  }

  getCountries(): { id: string; name: string }[] {
    return Object.entries(countryLibrary.getNames('en', { select: 'official' })).map((entry) => {
      return {
        id: entry[0],
        name: entry[1]
      };
    });
  }

  getCountry(countryKey: string): string {
    return countryLibrary.getName(countryKey, 'en');
  }
}
