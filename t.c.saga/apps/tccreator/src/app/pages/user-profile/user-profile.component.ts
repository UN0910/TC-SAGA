import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User, UserService, LocalStorageService } from '@t.c.saga/user';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'tccreator-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserProfileComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  isSubmitted = false;
  countries: { id: string; name: string; }[] = [];
  user!: User;
  currentUserId!: string;
  endsubs$: Subject<any> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();

    this.form = this.formBuilder.group({
      userName: [this.user.userName, Validators.required],
      email: [this.user.email, Validators.required],
      password: [''],
      phone: [this.user.phone],
      street: [this.user.street],
      apartment: [this.user.apartment],
      city: [this.user.city],
      country: [this.user.country],
      pincode: [this.user.pincode]
    })

    this.getCountries();
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
      street: this.form.controls.street.value,
      apartment: this.form.controls.apartment.value,
      city: this.form.controls.city.value,
      pincode: this.form.controls.pincode.value,
      country: this.form.controls.country.value,
    }

    this.updateUser(user);
  }

  private updateUser(user: User) {
    this.userService.updateUsers(user).pipe(takeUntil(this.endsubs$)).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: 'Profile Updated!!!' });
    },
      () => {
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: 'Profile Not Updated!!!' });
      });
  }

  private getCurrentUser() {
    const token: string | any = this.localStorageService.getToken();
    const tokenDecode = JSON.parse(atob(token.split('.')[1]));
    this.user = tokenDecode.user;
    this.currentUserId = tokenDecode.userId;
  }

  private getCountries() {
    this.countries = this.userService.getCountries();
  }

}
