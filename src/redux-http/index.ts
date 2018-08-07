import { EndpointResponse } from '@lib/endpoint';

export const REDUX_HTTP_CLIENT_REQUEST = '@@beccaccino/request';
export const REDUX_HTTP_CLIENT_ERROR = '@@beccaccino/error';
export const REDUX_HTTP_CLIENT_RESPONSE = '@@beccaccino/response';

export const REDUX_HTTP_ACTION_SIGNATURE = Symbol('REDUX:BECCACCINO_ACTION');

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

export type SelectorInputConf = {
  endpointName: string,
  limit?: number,
  sessionId?: string,
  useDefaultSession?: boolean,
};

export type SelectorInput = SelectorInputConf & {
  state: any,
};

export type BaseSelectorInput = SelectorInput & {
  responseMapper?: (meta: any, response: any) => any,
};

export type SelectorOutput = {
  result: any,
  metadata: any,
};

export type Selector = (input: SelectorInput) => Array<SelectorOutput | any>;

export { default as beccaccinoMiddleware } from '@lib/redux-http/middleware';
export { default as beccaccinoReducer } from '@lib/redux-http/reducer';
export { BECCACCINO_REDUCER_NAME } from '@lib/redux-http/reducer';
export * from '@lib/redux-http/selectors';
