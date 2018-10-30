export const REDUX_HTTP_CLIENT_REQUEST = '@@beccaccino/request';
export const REDUX_HTTP_CLIENT_ERROR = '@@beccaccino/error';
export const REDUX_HTTP_CLIENT_RESPONSE = '@@beccaccino/response';
export const REDUX_HTTP_ACTION_SIGNATURE = Symbol('REDUX:BECCACCINO_ACTION');
import { EndpointResponse } from '../endpoint';

export type BindedRequestDetails = {
  urlParams: any,
  requestPayload: any,
  endpointName: string,
  requestId: string,
  cancelRequest: Function,
  sessionId?: string,
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
