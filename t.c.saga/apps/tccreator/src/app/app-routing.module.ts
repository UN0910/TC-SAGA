import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "./service/auth-guard.service";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { OrderDetailComponent } from "./pages/orders/order-detail/order-detail.component";
import { OrderListComponent } from "./pages/orders/order-list/order-list.component";
import { ProductsFormComponent } from "./pages/products/products-form/products-form.component";
import { ProductsListComponent } from "./pages/products/products-list/products-list.component";
import { UserProfileComponent } from "./pages/user-profile/user-profile.component";
import { ShellComponent } from "./shared/shell/shell.component";

const routes: Routes = [
  {
    path: "", component: ShellComponent, canActivate: [AuthGuardService], children: [
      { path: "", component: DashboardComponent, pathMatch: "full" },
      { path: "products", component: ProductsListComponent, pathMatch: "full" },
      { path: "products/form", component: ProductsFormComponent, pathMatch: "full" },
      { path: "products/form/:id", component: ProductsFormComponent, pathMatch: "full" },
      { path: "orders", component: OrderListComponent, pathMatch: "full" },
      { path: "orders/:id", component: OrderDetailComponent, pathMatch: "full" },
      { path: "user-profile", component: UserProfileComponent, pathMatch: "full" },
      // { path: "**", redirectTo: "dashboard" }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
