import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Contact, ContactFormService } from '@t.c.saga/user';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tcadmin-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private confirmationService: ConfirmationService,
    private contactService: ContactFormService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.getContacts();
  }

  ngOnDestroy() {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  showContact(contactId: string) {
    this.router.navigateByUrl(`contacts/${contactId}`);
  }

  deleteContact(contactId: string) {
    this.confirmationService.confirm({
      message: 'Do you want to Delete this Contact Form?',
      header: 'Delete Contact Form',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.contactService.deleteContact(contactId).pipe(takeUntil(this.endsubs$)).subscribe(() => {
          this.getContacts();
          this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: 'Contact Form Deleted!!!' });
        },
          () => {
            this.messageService.add({ severity: 'error', summary: 'ERROR', detail: "Contact Form can't be Added!!!" });
          });
      }
    });

  }

  private getContacts() {
    this.contactService.getContacts().pipe(takeUntil(this.endsubs$)).subscribe((contacts) => {
      this.contacts = contacts;
    })
  }

}

