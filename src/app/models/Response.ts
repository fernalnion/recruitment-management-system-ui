export interface IResponse<T> {
  data: T;
  error: boolean;
  errorMessage?: string;
}

export interface IResponseArray<T> {
  data: {
    data: Array<T>;
    total: number;
  };
  error: boolean;
  errorMessage?: string;
}
