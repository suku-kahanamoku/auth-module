import type { IResponse } from "@suku-kahanamoku/common-module/types";

export interface IAddress {
  _id: string;
  street: string;
  city: string;
  zip: string;
  state: string;
  name?: string;
  country?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAddressResponse extends IResponse {
  data?: IAddress;
}

export interface IAddressesResponse extends IResponse {
  data?: IAddress[];
}
