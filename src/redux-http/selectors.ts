import {
  SelectorInput,
  BaseSelectorInput,
  SelectorOutput,
  BECCACCINO_REDUCER_NAME,
} from '@lib/redux-http';
import  { defaultSession } from '@lib/Beccaccino';

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
  responseMapper: (_, r: any) => r ? r.response : undefined,
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
