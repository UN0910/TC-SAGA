import { Injectable } from '@angular/core';

const TOKEN = 'tcsagaToken';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setToken(data: any) {
    localStorage.setItem(TOKEN, data);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN);
  }

  removeToken() {
    localStorage.removeItem(TOKEN);
  }
}
