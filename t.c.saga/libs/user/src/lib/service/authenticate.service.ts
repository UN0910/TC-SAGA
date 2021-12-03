import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  apiURLUsers = environment.apiURL + 'user';

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private router: Router
  ) { }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiURLUsers}/login`, { email, password });
  }

  register(userName: string, email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiURLUsers}/register`, { userName, email, password });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiURLUsers}/forgot-password`, { email });
  }

  resendVerification(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiURLUsers}/resend-verification`, { email });
  }

  resetPassword(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiURLUsers}/reset-password/${token}`);
  }

  resetFormPassword(password: string, token: string): Observable<any> {
    return this.http.post<any>(`${this.apiURLUsers}/reset-password/${token}`, { password });
  }

  logout() {
    this.localStorageService.removeToken();
    this.router.navigate(['/authenticate']);
  }
}
