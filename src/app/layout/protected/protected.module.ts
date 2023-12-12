import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModules } from 'src/app/shared.module';
import { ProtectedComponent } from './protected.component';
import { ProtectdRoutes } from './protected.routing';
import { UserService } from 'src/app/services/user.service';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(ProtectdRoutes), SharedModules],
  declarations: [ProtectedComponent],
  providers: [UserService],
})
export class ProtectedModule {}
