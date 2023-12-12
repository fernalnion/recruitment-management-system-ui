export interface IDepartmentBase {
  name: string;
  isDefault: boolean;
}

export interface IDepartment extends IDepartmentBase {
  _id: string;
}
