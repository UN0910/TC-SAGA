import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticateService } from '../../service/authenticate.service';
import { MessageService } from 'primeng/api';
import { LocalStorageService } from '../../service/local-storage.service';

@Component({
  selector: 'user-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss']
})
export class AuthenticateComponent implements OnInit {
  isforgot = false;
  isVerify = false;
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  forgotForm!: FormGroup;
  verifyForm!: FormGroup;
  isSubmitted = false;
  isSubmitted2 = false;
  isSubmitted3 = false;
  isSubmitted4 = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticateService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initLoginForm();
    this.initRegisterForm();
    this.initResetForm();
    this.initVerifyForm();
  }

  onSignUp() {
    const container: Element | any = document.querySelector(".container");

    container.classList.add("sign-up-mode");
  }

  onSignIn() {
    const container: Element | any = document.querySelector(".container");

    container.classList.remove("sign-up-mode");
  }

  private initLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]]
    })
  }

  private initRegisterForm() {
    this.registerForm = this.formBuilder.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]]
    })
  }

  private initResetForm() {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }

  private initVerifyForm() {
    this.verifyForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    })
  }

  onLoginSubmit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return
    }
    this.authService.login(this.loginForm.controls.email.value, this.loginForm.controls.password.value).subscribe(user => {
      this.messageService.add({ severity: 'info', summary: 'INFO', detail: `Not authorized to open this panel!!!` });
      this.localStorageService.setToken(user.token);
      this.router.navigate(['/']);
    },
      error => {
        if (error.status !== 400) {
          error.error = "Error in Server, please try again later!!!"
        }
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: `${error.error.error}` });
      })
  }

  onRegisterSubmit() {
    this.isSubmitted2 = true;
    if (this.registerForm.invalid) {
      return
    }
    this.authService.register(this.registerForm.controls.userName.value, this.registerForm.controls.email.value, this.registerForm.controls.password.value).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: `User Registered and in order to login, continue verification process!!!` });
      this.registerForm.reset();
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.setErrors(null);
      });
    },
      error => {
        if (error.status !== 400) {
          error.error = "Error in Server, please try again later!!!"
        }
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: `${error.error.error}` });
      })
  }

  onResetPassword() {
    this.isforgot = true;
  }
  onResetPasswordUndo() {
    this.isforgot = false;
  }

  onForgotSubmit() {
    this.isSubmitted3 = true;
    if (this.forgotForm.invalid) {
      return
    }
    this.authService.forgotPassword(this.forgotForm.controls.email.value).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: `PASSWORD RECOVERY INFORMATION HAS BEEN SENT TO YOUR EMAIL-ID!!!` });
      this.forgotForm.reset();
      Object.keys(this.forgotForm.controls).forEach(key => {
        this.forgotForm.get(key)?.setErrors(null);
      });
    },
      error => {
        if (error.status !== 400) {
          error.error = "Error in Server, please try again later!!!"
        }
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: `${error.error}` });
      })
  }

  onVerifyEmail() {
    this.isVerify = true;
  }

  onVerifyEmailUndo() {
    this.isVerify = false;
  }

  onVerifySubmit() {
    this.isSubmitted4 = true;
    if (this.verifyForm.invalid) {
      return
    }
    this.authService.resendVerification(this.verifyForm.controls.email.value).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: `VERIFICATION LINK HAS BEEN SENT TO YOUR EMAIL-ID!!!` });
      this.verifyForm.reset();
      Object.keys(this.verifyForm.controls).forEach(key => {
        this.verifyForm.get(key)?.setErrors(null);
      });
    },
      error => {
        if (error.status !== 400) {
          error.error = "Error in Server, please try again later!!!"
        }
        this.messageService.add({ severity: 'error', summary: 'ERROR', detail: `${error.error.error}` });
      })
  }
}
