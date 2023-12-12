export interface IResumeBase {
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  profilepath: string;
}

export interface IResume extends IResumeBase {
  _id: string;
}
