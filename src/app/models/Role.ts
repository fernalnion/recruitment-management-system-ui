export interface IRoleBase {
  name: string;
  isDefault: boolean;
}

export interface IRole extends IRoleBase {
  _id: string;
}
