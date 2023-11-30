import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServiceModule } from 'src/app/services/service.module';
import { SharedModules } from 'src/app/shared.module';
import { ApplicantComponent } from './applicant.component';
import { ApplicantRoutes } from './applicant.routing';

@NgModule({
  declarations: [ApplicantComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ApplicantRoutes),
    SharedModules,
    ServiceModule,
  ],
})
export class ApplicantModule {}
