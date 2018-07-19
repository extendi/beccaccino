import { AxiosResponse, AxiosError } from "axios";

export type ResponseTransform = (input : AxiosResponse) => any;
export type ErrorTransform = (input : AxiosError) => any;

export type Method =
  | 'get'
  | 'delete'
  | 'head'
  | 'options'
  | 'post'
  | 'put'
  | 'patch'

export type Endpoint = {
  path: string,
  method: Method,
  name: string,
  errorTransformer: ErrorTransform;
  responseTransformer: ResponseTransform,
}

export type Endpoints = Endpoint[];
