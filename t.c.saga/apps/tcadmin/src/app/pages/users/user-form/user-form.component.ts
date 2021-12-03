import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';
import { User, UserService } from '@t.c.saga/user';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface UserRole {
  name: string,
  id: string
}

@Component({
  selector: 'tcadmin-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserFormComponent implements OnInit, OnDestroy {
  editMode = false;
  form!: FormGroup;
  isSubmitted = false;
  currentUserId!: string;
  countries: { id: string; name: string; }[] = [];
  userRole: UserRole[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.userRole = [
      { name: 'ADMIN', id: 'ADMIN' },
      { name: 'CUSTOMER', id: 'CUSTOMER' },
      { name: 'CREATOR', id: 'CREATOR' },
    ];
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      isVerified: [false],
      userRole: ['CUSTOMER'],
      street: ['', Validators.required],
      apartment: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', Validators.required],
      country: ['', Validators.required]
    })

    this.getCountries();
    this.checkEditMode();
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
    const user: User = {
      _id: this.currentUserId,
      userName: this.form.controls.userName.value,
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
      phone: this.form.controls.phone.value,
      isVerified: this.form.controls.isVerified.value,
      userRole: this.form.controls.userRole.value,
      street: this.form.controls.street.value,
      apartment: this.form.controls.apartment.value,
      city: this.form.controls.city.value,
      pincode: this.form.controls.pincode.value,
      country: this.form.controls.country.value,
    };

    if (this.editMode) {
      this.updateUser(user);
    } else {
      this.addUser(user);
    }
  }

  private addUser(user: User) {
    this.userService.addUsers(user).pipe(takeUntil(this.endsubs$)).subscribe((user: User) => {
      this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: `User ${user.userName} Added!!!` });
    },
      () => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'User Not Added!!!' });
      });
    timer(2000).toPromise().then(() => {
      this.location.back();
    })
  }

  private updateUser(user: User) {
    this.userService.updateUsers(user).pipe(takeUntil(this.endsubs$)).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: 'User Updated!!!' });
    },
      () => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'User Not Updated!!!' });
      });
    timer(2000).toPromise().then(() => {
      this.location.back();
    })
  }

  private checkEditMode() {
    this.route.params.pipe(takeUntil(this.endsubs$)).subscribe(params => {
      if (params.id) {
        this.editMode = true;
        this.currentUserId = params.id;
        this.userService.getUser(params.id).subscribe(user => {
          this.form.controls.userName.setValue(user.userName);
          this.form.controls.email.setValue(user.email);
          this.form.controls.password.setValue(user.password);
          this.form.controls.phone.setValue(user.phone);
          this.form.controls.isVerified.setValue(user.isVerified);
          this.form.controls.userRole.setValue(user.userRole);
          this.form.controls.street.setValue(user.street);
          this.form.controls.apartment.setValue(user.apartment);
          this.form.controls.city.setValue(user.city);
          this.form.controls.pincode.setValue(user.pincode);
          this.form.controls.country.setValue(user.country);

          this.form.controls.password.setValidators([]);
          this.form.controls.password.updateValueAndValidity();
        })
      }
    })
  }

  private getCountries() {
    this.countries = this.userService.getCountries();
  }

  onCancel() {
    this.location.back();
  }

}
