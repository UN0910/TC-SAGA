import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserModule } from '@t.c.saga/user';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ShortenPipe } from './shared/pipe/shorten.pipe';

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
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ShellComponent } from './shared/shell/shell.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CardsComponent } from './pages/cards/cards.component';
import { OrdersModule } from '@t.c.saga/orders';
import { BadgeModule } from 'primeng/badge';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [AppComponent, HomeComponent, AboutComponent, ContactUsComponent, HeaderComponent, FooterComponent, ShellComponent, ProfileComponent, CardsComponent, ShortenPipe, CartComponent, CheckoutComponent, ThankYouComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    UserModule,
    OrdersModule,
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
    PasswordModule,
    BadgeModule
  ],
  providers: [
    MessageService,
    ConfirmationService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
