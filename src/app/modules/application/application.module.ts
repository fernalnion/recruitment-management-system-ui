import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationComponent } from './application.component';
import { RouterModule } from '@angular/router';
import { ApplicationRoutes } from './application.routing';
import { SharedModules } from 'src/app/shared.module';
import { ServiceModule } from 'src/app/services/service.module';

@NgModule({
  declarations: [ApplicationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ApplicationRoutes),
    SharedModules,
    ServiceModule,
  ],
})
export class ApplicationModule {}
