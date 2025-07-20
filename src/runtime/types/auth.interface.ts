export interface IAuth {
  GET: IPermission;
  POST: IPermission;
  PATCH: IPermission;
  DELETE: IPermission;
  PUT: IPermission;
}

export interface IPermission {
  resource: string;
  scope: "view" | "create" | "update" | "delete";
  policy?: string;
}

export interface ITokens {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}
