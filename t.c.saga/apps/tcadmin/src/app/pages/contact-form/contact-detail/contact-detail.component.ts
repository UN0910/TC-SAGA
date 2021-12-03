import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Contact, ContactFormService } from '@t.c.saga/user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tcadmin-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactDetailComponent implements OnInit {

  contact!: Contact;
  endsubs$: Subject<any> = new Subject();

  constructor(
    private contactService: ContactFormService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getContact();
  }

  ngOnDestroy() {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  private getContact() {
    this.route.params.pipe(takeUntil(this.endsubs$)).subscribe(params => {
      if (params.id) {
        this.contactService.getContact(params.id).subscribe(contact => {
          this.contact = contact;
        })
      }
    });
  }
}
