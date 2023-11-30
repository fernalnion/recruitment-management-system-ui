import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResponse, IResponseArray } from '../models/Response';
import { IApplication, IApplicationBase } from '../models/application';

@Injectable()
export class ApplicationService {
  constructor(private http: HttpClient) {}

  saveApplication = (payload: IApplicationBase) => {
    return this.http
      .post<IResponse<IApplication>>(`${environment.API}/application`, {
        ...payload,
      })
      .pipe(map((data) => data.data));
  };

  getApplications = () => {
    return this.http
      .get<IResponseArray<IApplication>>(`${environment.API}/application/all`)
      .pipe(map((data) => data.data));
  };

  getApplication = (id: string) => {
    return this.http
      .get<IResponse<IApplication>>(`${environment.API}/application/${id}`)
      .pipe(map((data) => data.data));
  };

  updateApplication = (id: string, payload: Partial<IApplicationBase>) => {
    return this.http
      .put<IResponse<IApplication>>(`${environment.API}/application/${id}`, {
        ...payload,
      })
      .pipe(map((data) => data.data));
  };

  deleteApplication = (id: string) => {
    return this.http
      .delete<IResponse<Boolean>>(`${environment.API}/application/${id}`)
      .pipe(map((data) => data.data));
  };
}
