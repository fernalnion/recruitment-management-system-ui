import { AuthService } from './auth.service';

export const jwtOptionsFactory = (authService: AuthService) => ({
  tokenGetter: () => authService.getAccessToken(),
  authScheme: () => 'Bearer ',
  skipWhenExpired: true,
  allowedDomains: ['*'],
});
