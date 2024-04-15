import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AppRouteGuard } from './app-route.guard';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';
import { EmployeeDetailsComponent } from './components/employee-details/employee-details.component';

const routes:Routes=[
  {
    path:'',component:LoginComponent
  },
   {path:'signup',component:SignUpComponent},
   {path:"login",component:LoginComponent},
   {path:"manager",canActivate:[AppRouteGuard],component:DashboardComponent},
   {path:"emp-dashboard",component:EmployeeDashboardComponent},
   { path:'emp-form', component: EmployeeDetailsComponent},
   { path:'emp-form/:action', component: EmployeeDetailsComponent},
   { path:'emp-form/:action/:Id', component: EmployeeDetailsComponent}
 ]


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
