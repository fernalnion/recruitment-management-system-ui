import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicComponent } from './public.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RouterModule } from '@angular/router';
import { PublicRoutes } from './public.routing';
import { SharedModules } from 'src/app/shared.module';
import { AuthService } from 'src/app/services/auth.service';

@NgModule({
  declarations: [PublicComponent, LoginComponent, RegisterComponent],
  imports: [CommonModule, SharedModules, RouterModule.forChild(PublicRoutes)],
  providers: [AuthService],
})
export class PublicModule {}
