import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResponse } from '../models/Response';
import { IResume, IResumeBase } from '../models/resume';

@Injectable()
export class ResumeService {
  $resumes: Observable<Array<IResume>> = new Observable();
  $count: Observable<number> = new Observable();
  constructor(private http: HttpClient) {
    this.$resumes = this.getResumes();
    this.$resumes.subscribe((resumes) => {
      this.$count = of(resumes.length);
    });
  }

  private saveResume = (payload: IResumeBase) => {
    return this.http
      .post<IResponse<IResume>>(`${environment.API}/resume`, {
        ...payload,
      })
      .pipe(map((data) => data.data));
  };

  private getResumes = () => {
    return this.http
      .get<IResponse<Array<IResume>>>(`${environment.API}/resume/all`)
      .pipe(map((data) => data.data));
  };

  private getResume = (id: string) => {
    return this.http
      .get<IResponse<IResume>>(`${environment.API}/resume/${id}`)
      .pipe(map((data) => data.data));
  };

  private getResumeFile = (id: string) => {
    return this.http
      .get<IResponse<any>>(`${environment.API}/resume/${id}/file`)
      .pipe(map((data) => data.data));
  };

  private updateResume = (id: string, payload: Partial<IResumeBase>) => {
    return this.http
      .put<IResponse<IResume>>(`${environment.API}/resume/${id}`, {
        ...payload,
      })
      .pipe(map((data) => data.data));
  };

  private deleteResume = (id: string) => {
    return this.http
      .delete<IResponse<Boolean>>(`${environment.API}/resume/${id}`)
      .pipe(map((data) => data.data));
  };
}
