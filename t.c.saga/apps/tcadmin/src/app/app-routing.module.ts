import { NgModule } from '@angular/core';
import { AuthGuardService } from './service/auth-guard.service';
import { RouterModule, Routes } from '@angular/router';
import { CategoryFormComponent } from './pages/categories/category-form/category-form.component';
import { CategoryListComponent } from './pages/categories/category-list/category-list.component';
import { OrderDetailComponent } from './pages/orders/order-detail/order-detail.component';
import { OrderListComponent } from './pages/orders/order-list/order-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductFormComponent } from './pages/products/product-form/product-form.component';
import { ProductListComponent } from './pages/products/product-list/product-list.component';
import { ShellComponent } from './shared/shell/shell.component';
import { UserFormComponent } from './pages/users/user-form/user-form.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { AdminsComponent } from './pages/admins/admins.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ContactListComponent } from './pages/contact-form/contact-list/contact-list.component';
import { ContactDetailComponent } from './pages/contact-form/contact-detail/contact-detail.component';

const routes: Routes = [
  {
    path: "", component: ShellComponent, canActivate: [AuthGuardService], children: [
      { path: "", component: DashboardComponent, pathMatch: "full" },
      { path: "products", component: ProductListComponent, pathMatch: "full" },
      { path: "products/form", component: ProductFormComponent, pathMatch: "full" },
      { path: "products/form/:id", component: ProductFormComponent, pathMatch: "full" },
      { path: "categories", component: CategoryListComponent, pathMatch: "full" },
      { path: "categories/form", component: CategoryFormComponent, pathMatch: "full" },
      { path: "categories/form/:id", component: CategoryFormComponent, pathMatch: "full" },
      { path: "orders", component: OrderListComponent, pathMatch: "full" },
      { path: "orders/:id", component: OrderDetailComponent, pathMatch: "full" },
      { path: "users", component: UserListComponent, pathMatch: "full" },
      { path: "users/form", component: UserFormComponent, pathMatch: "full" },
      { path: "users/form/:id", component: UserFormComponent, pathMatch: "full" },
      { path: "admins", component: AdminsComponent, pathMatch: "full" },
      { path: "contacts", component: ContactListComponent, pathMatch: "full" },
      { path: "contacts/:id", component: ContactDetailComponent, pathMatch: "full" },
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
