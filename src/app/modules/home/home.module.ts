import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModules } from 'src/app/shared.module';
import { HomeComponent } from './home.component';
import { HomeRoutes } from './home.routing';
import { ServiceModule } from 'src/app/services/service.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(HomeRoutes),
    SharedModules,
    ServiceModule,
  ],
  providers: [],
})
export class HomeModule {}
