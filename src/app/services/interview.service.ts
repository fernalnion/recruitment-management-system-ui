import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResponse, IResponseArray } from '../models/Response';
import { IInterview, IInterviewtBase } from '../models/interview';

@Injectable()
export class InterviewService {
  constructor(private http: HttpClient) {}

  saveInterview = (payload: IInterviewtBase) => {
    return this.http
      .post<IResponse<IInterview>>(`${environment.API}/interview`, {
        ...payload,
      })
      .pipe(map((data) => data.data));
  };

  getInterviews = (upcoming?: boolean) => {
    return this.http
      .get<IResponseArray<IInterview>>(
        `${environment.API}/interview/all?upcoming=${!!upcoming}`
      )
      .pipe(map((data) => data.data));
  };
  getInterview = (id: string) => {
    return this.http
      .get<IResponse<IInterview>>(`${environment.API}/interview/${id}`)
      .pipe(map((data) => data.data));
  };

  updateInterview = (id: string, payload: Partial<IInterviewtBase>) => {
    return this.http
      .put<IResponse<IInterview>>(`${environment.API}/interview/${id}`, {
        ...payload,
      })
      .pipe(map((data) => data.data));
  };

  deleteInterview = (id: string) => {
    return this.http
      .delete<IResponse<Boolean>>(`${environment.API}/interview/${id}`)
      .pipe(map((data) => data.data));
  };
}
