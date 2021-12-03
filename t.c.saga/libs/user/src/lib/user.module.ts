import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { AuthenticateComponent } from './pages/authenticate/authenticate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

export const userRoutes: Route[] = [
  { path: 'authenticate', component: AuthenticateComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes),
    FormsModule,
    ReactiveFormsModule,
    ToastModule
  ],
  declarations: [
    AuthenticateComponent
  ],
})
export class UserModule { }
