import { BECCACCINO_REDUCER_NAME } from './reducer';
import  { defaultSession } from '../Beccaccino';

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

export const beccaccinoSelector = (input: BaseSelectorInput): Array<SelectorOutput | any> => {
  const sessionId = input.sessionId || defaultSession;
  const defaultMapper = (metadata: any, r: any): SelectorOutput => ({
    metadata,
    result: r.response,
  });

  const mapperToApply = input.responseMapper || defaultMapper;

  const beccaccinoState = input.state[BECCACCINO_REDUCER_NAME];

  const allRequestIdsForEndpoint =
    (beccaccinoState.requestsLog[sessionId] || {})[input.endpointName];
  const requestIdsForEndpoint = allRequestIdsForEndpoint &&
    allRequestIdsForEndpoint.requests.slice(
      ...(input.limit > 0 ? [0, input.limit] : [input.limit, undefined]),
    );
  if (!requestIdsForEndpoint) return null;

  const requestsMetadata = beccaccinoState.requestsMetadata || {};
  const results = beccaccinoState.results || {};
  return requestIdsForEndpoint.map((id: any) => mapperToApply(requestsMetadata[id], results[id]));
};

export const resultSelector = (input: SelectorInput): Array<any> => beccaccinoSelector({
  ...input,
  responseMapper: (meta: any, r: any) => r
    && !meta.isLoading
    && meta.success ? r.response : undefined,
});

export const errorSelector = (input: SelectorInput): Array<any> => beccaccinoSelector({
  ...input,
  responseMapper: (meta: any, r: any) => (
    { error: !meta.isLoading && !meta.success, response: r ? r.response : undefined }
  ),
});

export const loadingSelector = (input: SelectorInput): Array<boolean> => beccaccinoSelector({
  ...input,
  responseMapper: (meta: any, _) => meta.isLoading,
});

export const cancelTokenSelector = (input: SelectorInput): Array<boolean> => beccaccinoSelector({
  ...input,
  responseMapper: (_, r: any) => r ? r.requestDetails.cancelRequest : undefined,
});
