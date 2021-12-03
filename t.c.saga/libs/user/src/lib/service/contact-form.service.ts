import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Contact } from '../model/contact';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactFormService {

  apiURLContacts = environment.apiURL + 'contact';

  constructor(private http: HttpClient) { }

  getContact(contactId: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiURLContacts}/${contactId}`);
  }

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiURLContacts);
  }

  addContacts(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiURLContacts, contact);
  }

  deleteContact(contactId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURLContacts}/${contactId}`);
  }

  updateContacts(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiURLContacts}/${contact._id}`, contact);
  }
}
