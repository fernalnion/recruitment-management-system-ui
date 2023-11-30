import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServiceModule } from 'src/app/services/service.module';
import { SharedModules } from 'src/app/shared.module';
import { DepartmentComponent } from './department.component';
import { DepartmentRoutes } from './department.routing';

@NgModule({
  declarations: [DepartmentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DepartmentRoutes),
    SharedModules,
    ServiceModule,
  ],
})
export class DepartmentModule {}
