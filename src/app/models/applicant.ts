export interface IApplicantBase {
  firstname: string;
  lastname?: string;
  email: string;
  mobile: string;
}

export interface IApplicantSave {
  firstname: string;
  lastname?: string;
  email: string;
  mobile: string;
  image: any;
}

export interface IApplicant extends IApplicantBase {
  _id: string;
  profileimage?: string;
}
