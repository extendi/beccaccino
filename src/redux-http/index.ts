import { EndpointResponse } from '@lib/endpoint';

export const REDUX_HTTP_CLIENT_REQUEST = '@@redux_http_client/request';
export const REDUX_HTTP_CLIENT_ERROR = '@@redux_http_client/error';
export const REDUX_HTTP_CLIENT_RESPONSE = '@@redux_http_client/response';

export const REDUX_HTTP_ACTION_SIGNATURE = Symbol('REDUX:HTTP_CLIENT_ACTION');

export type BindedRequestDetails = {
  urlParams: any,
  requestPayload: any,
  endpointName: string,
};

export type BindedActionPayload = {
  type: string,
  signature: Symbol,
  requestDetails: BindedRequestDetails,
  execAsync: Promise<EndpointResponse>,
};

export type BindedActionResultPayload = {
  type: string,
  requestDetails: BindedRequestDetails,
  response: EndpointResponse,
};

export { default as reduxHttpMiddleware } from '@lib/redux-http/middleware';
export { default as reduxHttpReducer } from '@lib/redux-http/reducer';
