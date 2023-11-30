import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get the authentication token from the service
    const authToken = this.authService.getAccessToken();

    // Clone the request and add the authorization header if the token is available
    const authRequest = authToken
      ? request.clone({
          setHeaders: {
            Authorization: `Bearer ${authToken}`,
          },
        })
      : request;

    // Pass the cloned request with the updated header to the next handler
    return next.handle(authRequest);
  }
}
