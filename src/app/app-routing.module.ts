import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RgisterComponent } from './rgister/rgister.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { EditUserDetailsComponent } from './edit-user-details/edit-user-details.component';

const  appRoutes: Routes = [
  {path:'dashboard' , component :UserDashboardComponent },
  { path: 'register', component: RgisterComponent },
  { path: 'login', component: LoginComponent },
  {path: 'edit/:id', component: EditUserDetailsComponent},
  { path: '', redirectTo: '/register', pathMatch: 'full' }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
