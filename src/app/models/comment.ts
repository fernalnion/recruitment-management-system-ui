export interface ICommentBase {
  title: string;
  description: string;
  application: string;
}

export interface IComment extends ICommentBase {
  _id: string;
}
