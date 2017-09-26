
import { Routes, RouterModule } from '@angular/router'
import { NgModule } from '@angular/core';

import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RegisterComponent } from './pages/register/register.component';

const appRoutes: Routes = [
    {path : '', component : HomeComponent},
    {path : 'dashboard', component : DashboardComponent},
    {path : 'register', component : RegisterComponent},

    {path : '**', component : HomeComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})


export class AppRouting { }