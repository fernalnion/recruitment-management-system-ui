import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResponse, IResponseArray } from '../models/Response';
import { IDepartment, IDepartmentBase } from '../models/department';

@Injectable()
export class DepartmentService {
  constructor(private http: HttpClient) {}

  saveDepartment = (payload: IDepartmentBase) => {
    return this.http
      .post<IResponse<IDepartment>>(`${environment.API}/department`, {
        ...payload,
      })
      .pipe(map((data) => data.data));
  };

  getDepartments = () => {
    return this.http
      .get<IResponseArray<IDepartment>>(`${environment.API}/department/all`)
      .pipe(map((data) => data.data));
  };

  getDepartment = (id: string) => {
    return this.http
      .get<IResponse<IDepartment>>(`${environment.API}/department/${id}`)
      .pipe(map((data) => data.data));
  };

  updateDepartment = (id: string, payload: Partial<IDepartmentBase>) => {
    return this.http
      .put<IResponse<IDepartment>>(`${environment.API}/department/${id}`, {
        ...payload,
      })
      .pipe(map((data) => data.data));
  };

  deleteDepartment = (id: string) => {
    return this.http
      .delete<IResponse<Boolean>>(`${environment.API}/department/${id}`)
      .pipe(map((data) => data.data));
  };
}
