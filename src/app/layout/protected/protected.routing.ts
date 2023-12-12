import { Routes } from '@angular/router';
import { ProtectedComponent } from './protected.component';
import { HomeComponent } from 'src/app/modules/home/home.component';

export const ProtectdRoutes: Routes = [
  {
    path: '',
    component: ProtectedComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('../../modules/home/home.module').then(
            (module) => module.HomeModule
          ),
      },
      {
        path: 'applicants',
        loadChildren: () =>
          import('../../modules/applicant/applicant.module').then(
            (module) => module.ApplicantModule
          ),
      },
      {
        path: 'roles',
        loadChildren: () =>
          import('../../modules/role/role.module').then(
            (module) => module.RoleModule
          ),
      },
      {
        path: 'departments',
        loadChildren: () =>
          import('../../modules/department/department.module').then(
            (module) => module.DepartmentModule
          ),
      },
      {
        path: 'jobs',
        loadChildren: () =>
          import('../../modules/job/job.module').then(
            (module) => module.JobModule
          ),
      },
      {
        path: 'applications',
        loadChildren: () =>
          import('../../modules/application/application.module').then(
            (module) => module.ApplicationModule
          ),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];
