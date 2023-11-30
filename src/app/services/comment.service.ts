import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResponse, IResponseArray } from '../models/Response';
import { IComment, ICommentBase } from '../models/comment';

@Injectable()
export class CommentService {
  constructor(private http: HttpClient) {}

  saveComment = (payload: ICommentBase) => {
    return this.http
      .post<IResponse<IComment>>(`${environment.API}/comment`, {
        ...payload,
      })
      .pipe(map((data) => data.data));
  };

  getComments = () => {
    return this.http
      .get<IResponseArray<IComment>>(`${environment.API}/comment/all`)
      .pipe(map((data) => data.data));
  };

  getComment = (id: string) => {
    return this.http
      .get<IResponse<IComment>>(`${environment.API}/comment/${id}`)
      .pipe(map((data) => data.data));
  };

  updateComment = (id: string, payload: Partial<ICommentBase>) => {
    return this.http
      .put<IResponse<IComment>>(`${environment.API}/comment/${id}`, {
        ...payload,
      })
      .pipe(map((data) => data.data));
  };

  deleteComment = (id: string) => {
    return this.http
      .delete<IResponse<Boolean>>(`${environment.API}/comment/${id}`)
      .pipe(map((data) => data.data));
  };
}
