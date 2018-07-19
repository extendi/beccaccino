import { AxiosResponse } from "axios";

export const REDUX_HTTP_CLIENT_REQUEST = '@@redux_http_client/request';

export type BindedActionPayload = {
  type: string,
  signature: Symbol,
  execAsync: Promise<AxiosResponse>,
};
