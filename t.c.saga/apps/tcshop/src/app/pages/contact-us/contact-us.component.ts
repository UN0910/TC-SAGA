import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Contact, ContactFormService } from '@t.c.saga/user';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tcshop-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  isSubmitted = false;
  endsubs$: Subject<any> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private contactService: ContactFormService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    })
  }

  ngOnDestroy() {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return
    }
    const contact: Contact = {
      name: this.form.controls.name.value,
      email: this.form.controls.email.value,
      phone: this.form.controls.phone.value,
      message: this.form.controls.message.value
    };
    this.addContact(contact);
  }

  private addContact(contact: Contact) {
    this.contactService.addContacts(contact).pipe(takeUntil(this.endsubs$)).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: `Form Submitted!!!` });
      this.form.reset();
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.setErrors(null);
      });
    },
      () => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: `Form can't be Submitted!!!` });
      });
  }

}
