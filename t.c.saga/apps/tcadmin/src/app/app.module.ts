import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor, UserModule } from '@t.c.saga/user';

import { CategoryService } from '@t.c.saga/products';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { ShellComponent } from './shared/shell/shell.component';
import { ProductListComponent } from './pages/products/product-list/product-list.component';
import { ProductFormComponent } from './pages/products/product-form/product-form.component';
import { CategoryFormComponent } from './pages/categories/category-form/category-form.component';
import { CategoryListComponent } from './pages/categories/category-list/category-list.component';
import { OrderListComponent } from './pages/orders/order-list/order-list.component';
import { OrderDetailComponent } from './pages/orders/order-detail/order-detail.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserFormComponent } from './pages/users/user-form/user-form.component';
import { ContactDetailComponent } from './pages/contact-form/contact-detail/contact-detail.component';
import { ContactListComponent } from './pages/contact-form/contact-list/contact-list.component';
import { AdminsComponent } from './pages/admins/admins.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ColorPickerModule } from 'primeng/colorpicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { EditorModule } from 'primeng/editor';
import { TagModule } from 'primeng/tag';
import { PasswordModule } from 'primeng/password';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ShellComponent,
    ProductListComponent,
    ProductFormComponent,
    CategoryFormComponent,
    CategoryListComponent,
    OrderListComponent,
    OrderDetailComponent,
    UserListComponent,
    UserFormComponent,
    AdminsComponent,
    UserProfileComponent,
    ContactDetailComponent,
    ContactListComponent],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    UserModule,
    CardModule,
    FieldsetModule,
    ToolbarModule,
    ButtonModule,
    SplitButtonModule,
    TableModule,
    InputTextModule,
    ToastModule,
    ConfirmDialogModule,
    ColorPickerModule,
    InputNumberModule,
    InputTextareaModule,
    DropdownModule,
    InputSwitchModule,
    EditorModule,
    TagModule,
    PasswordModule
  ],
  providers: [
    CategoryService,
    MessageService,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule { }
