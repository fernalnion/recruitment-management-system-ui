import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResponse, IResponseArray } from '../models/Response';
import { IRole, IRoleBase } from '../models/Role';

@Injectable()
export class RoleService {
  constructor(private http: HttpClient) {}

  saveRole = (payload: IRoleBase) => {
    return this.http
      .post<IResponse<IRole>>(`${environment.API}/role`, {
        ...payload,
      })
      .pipe(map((data) => data.data));
  };

  getRoles = () => {
    return this.http
      .get<IResponseArray<IRole>>(`${environment.API}/role/all`)
      .pipe(map((data) => data.data));
  };

  getRole = (id: string) => {
    return this.http
      .get<IResponse<IRole>>(`${environment.API}/role/${id}`)
      .pipe(map((data) => data.data));
  };

  updateRole = (id: string, payload: Partial<IRoleBase>) => {
    return this.http
      .put<IResponse<IRole>>(`${environment.API}/role/${id}`, {
        ...payload,
      })
      .pipe(map((data) => data.data));
  };

  deleteRole = (id: string) => {
    return this.http
      .delete<IResponse<Boolean>>(`${environment.API}/role/${id}`)
      .pipe(map((data) => data.data));
  };
}
