import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResponse, IResponseArray } from '../models/Response';
import { IJob, IJobBase } from '../models/job';
import { IDepartment } from '../models/department';

@Injectable()
export class JobService {
  constructor(private http: HttpClient) {}

  saveJob = (payload: IJobBase) => {
    return this.http
      .post<IResponse<IJob>>(`${environment.API}/job`, {
        ...payload,
      })
      .pipe(map((data) => data.data));
  };

  getJobs = (filters?: Partial<IDepartment>) => {
    const query = filters
      ? Object.entries(filters)
          .filter(
            ([, value]) => value !== null && value !== undefined && value !== ''
          )
          .map(([key, value]) => `${key}=${value}`)
          .join('&')
      : '';
    return this.http
      .get<IResponseArray<IJob>>(
        `${environment.API}/job/all${query.length ? '?' : ''}${query}`
      )
      .pipe(map((data) => data.data));
  };

  getJob = (id: string) => {
    return this.http
      .get<IResponse<IJob>>(`${environment.API}/job/${id}`)
      .pipe(map((data) => data.data));
  };

  updateJob = (id: string, payload: Partial<IJobBase>) => {
    return this.http
      .put<IResponse<IJob>>(`${environment.API}/job/${id}`, {
        ...payload,
      })
      .pipe(map((data) => data.data));
  };

  deleteJob = (id: string) => {
    return this.http
      .delete<IResponse<Boolean>>(`${environment.API}/job/${id}`)
      .pipe(map((data) => data.data));
  };
}
