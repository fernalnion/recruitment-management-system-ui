import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResponse, IResponseArray } from '../models/Response';
import { IApplicant, IApplicantSave } from '../models/applicant';

@Injectable()
export class ApplicantService {
  constructor(private http: HttpClient) {}

  saveApplicant = (payload: IApplicantSave) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return this.http
      .post<IResponse<IApplicant>>(`${environment.API}/applicant`, formData)
      .pipe(map((data) => data.data));
  };

  getApplicants = () => {
    return this.http
      .get<IResponseArray<IApplicant>>(`${environment.API}/applicant/all`)
      .pipe(map((data) => data.data));
  };
  getApplicant = (id: string) => {
    return this.http
      .get<IResponse<IApplicant>>(`${environment.API}/applicant/${id}`)
      .pipe(map((data) => data.data));
  };

  updateApplicant = (id: string, payload: Partial<IApplicantSave>) => {
    return this.http
      .put<IResponse<IApplicant>>(`${environment.API}/applicant/${id}`, {
        ...payload,
      })
      .pipe(map((data) => data.data));
  };

  deleteApplicant = (id: string) => {
    return this.http
      .delete<IResponse<Boolean>>(`${environment.API}/applicant/${id}`)
      .pipe(map((data) => data.data));
  };
}
