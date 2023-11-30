import { IApplicant, IApplicantBase } from './applicant';
import { IJob } from './job';

export interface IApplicationBase {
  status: string;
  appliedAt: Date;
  applicant: string;
  job: string;
}

export interface IApplication extends IApplicationBase {
  _id: string;
}
