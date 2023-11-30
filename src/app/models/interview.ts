export interface IInterviewtBase {
  isCanceled: boolean;
  scheduleAt: Date;
  application: string;
  applicant: string;
}

export interface IInterview extends IInterviewtBase {
  _id: string;
}
