import { NgModule } from '@angular/core';
import { ApplicantService } from './applicant.service';
import { InterviewService } from './interview.service';
import { ApplicationService } from './application.service';
import { CommentService } from './comment.service';
import { DepartmentService } from './department.service';
import { JobService } from './job.service';
import { RoleService } from './role.service';

const SERVICES = [
  ApplicantService,
  InterviewService,
  ApplicationService,
  CommentService,
  DepartmentService,
  JobService,
  RoleService,
];
@NgModule({
  providers: [...SERVICES],
})
export class ServiceModule {}
