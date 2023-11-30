import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleComponent } from './role.component';
import { RouterModule } from '@angular/router';
import { RoleRoutes } from './role.routing';
import { SharedModules } from 'src/app/shared.module';
import { ServiceModule } from 'src/app/services/service.module';

@NgModule({
  declarations: [RoleComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(RoleRoutes),
    SharedModules,
    ServiceModule,
  ],
})
export class RoleModule {}
