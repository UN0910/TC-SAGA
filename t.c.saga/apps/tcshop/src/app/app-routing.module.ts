import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthenticateComponent, AuthGuardService } from "@t.c.saga/user";
import { AboutComponent } from "./pages/about/about.component";
import { CardsComponent } from "./pages/cards/cards.component";
import { CartComponent } from "./pages/cart/cart.component";
import { CheckoutComponent } from "./pages/checkout/checkout.component";
import { ContactUsComponent } from "./pages/contact-us/contact-us.component";
import { HomeComponent } from "./pages/home/home.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { ThankYouComponent } from "./pages/thank-you/thank-you.component";

const routes: Routes = [
  { path: "", component: HomeComponent, pathMatch: "full" },
  { path: "cards", component: CardsComponent, pathMatch: "full" },
  { path: "about-us", component: AboutComponent, pathMatch: "full" },
  { path: "contact-us", component: ContactUsComponent, pathMatch: "full" },
  { path: "profile", component: ProfileComponent, pathMatch: "full", canActivate: [AuthGuardService] },
  { path: "cart", component: CartComponent, pathMatch: "full" },
  { path: "checkout", component: CheckoutComponent, pathMatch: "full", canActivate: [AuthGuardService] },
  { path: "thank-you", component: ThankYouComponent, pathMatch: "full", canActivate: [AuthGuardService] },
  { path: "authenticate", component: AuthenticateComponent, pathMatch: "full" },
  // { path: "**", redirectTo: "dashboard" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
