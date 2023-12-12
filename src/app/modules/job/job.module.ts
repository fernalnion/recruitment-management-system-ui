import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobComponent } from './job.component';
import { JobRoutes } from './job.routing';
import { RouterModule } from '@angular/router';
import { SharedModules } from 'src/app/shared.module';
import { ServiceModule } from 'src/app/services/service.module';

@NgModule({
  declarations: [JobComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(JobRoutes),
    SharedModules,
    ServiceModule,
  ],
})
export class JobModule {}
