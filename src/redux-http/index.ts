import { AxiosResponse } from 'axios';

export const REDUX_HTTP_CLIENT_REQUEST = '@@redux_http_client/request';
export const REDUX_HTTP_CLIENT_ERROR = '@@redux_http_client/error';
export const REDUX_HTTP_CLIENT_RESPONSE = '@@redux_http_client/response';

export const REDUX_HTTP_ACTION_SIGNATURE = Symbol('REDUX:HTTP_CLIENT_ACTION');

export type BindedActionPayload = {
  type: string,
  signature: Symbol,
  requestDetails: {
    urlParams: any,
    requestPayload : any,
  }
  execAsync: Promise<AxiosResponse>,
};
