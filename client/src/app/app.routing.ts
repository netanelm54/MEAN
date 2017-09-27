
import { Routes, RouterModule } from '@angular/router'
import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';

import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component'
import { ProfileComponent } from './pages/profile/profile.component';


const appRoutes: Routes = [
    {path : '', component : HomeComponent},
    {path : 'dashboard', component : DashboardComponent, canActivate: [AuthGuard]},
    {path : 'register', component : RegisterComponent, canActivate: [NotAuthGuard]},
    {path : 'login', component : LoginComponent, canActivate: [NotAuthGuard]},
    {path : 'profile', component : ProfileComponent, canActivate: [AuthGuard]},

    {path : '**', component : HomeComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})


export class AppRouting { }