import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor, UserModule } from '@t.c.saga/user';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { HeaderComponent } from './shared/header/header.component';
import { ShellComponent } from './shared/shell/shell.component';
import { FooterComponent } from './shared/footer/footer.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrderListComponent } from './pages/orders/order-list/order-list.component';
import { OrderDetailComponent } from './pages/orders/order-detail/order-detail.component';
import { ProductsFormComponent } from './pages/products/products-form/products-form.component';
import { ProductsListComponent } from './pages/products/products-list/products-list.component';
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
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [AppComponent, SidebarComponent, HeaderComponent, ShellComponent, FooterComponent, DashboardComponent, UserProfileComponent, OrderListComponent, OrderDetailComponent, ProductsFormComponent, ProductsListComponent],
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
    TagModule
  ],
  providers: [
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
