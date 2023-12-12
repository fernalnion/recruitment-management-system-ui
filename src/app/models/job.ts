export interface IJobBase {
  title: string;
  description: string;
  department: string;
  openings: number;
  skills: string[];
  postedAt: Date;
  isActive: boolean;
}

export interface IJob extends IJobBase {
  _id: string;
}
