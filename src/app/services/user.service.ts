import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser, IUserBase } from '../models/User';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { IResponse } from '../models/Response';
import { Observable, map } from 'rxjs';

@Injectable()
export class UserService {
  $user: Observable<IUser> = new Observable();
  constructor(
    private http: HttpClient,
    private readonly authService: AuthService
  ) {
    this.$user = this.getUser();
  }

  private getUsers = () => {
    return this.http
      .get<IResponse<Array<IUser>>>(`${environment.API}/user/all`)
      .pipe(map((data) => data.data));
  };

  private getUser = () => {
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.authService.logout();
    }
    return this.http
      .get<IResponse<IUser>>(`${environment.API}/user/${user?.id}`)
      .pipe(map((data) => data.data));
  };

  private updateUser = (id: string, payload: Partial<IUserBase>) => {
    return this.http
      .put<IResponse<IUser>>(`${environment.API}/user/${id}`, {
        ...payload,
      })
      .pipe(map((data) => data.data));
  };

  private deleteUser = (id: string) => {
    return this.http
      .delete<IResponse<Boolean>>(`${environment.API}/user/${id}`)
      .pipe(map((data) => data.data));
  };
}
