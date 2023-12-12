export interface IAccessToken {
  accessToken: string;
}

export interface IAccessTokenBody {
  id: string;
  iat: number;
  exp: number;
}
