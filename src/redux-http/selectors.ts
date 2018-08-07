import {
  SelectorInput,
  BaseSelectorInput,
  SelectorOutput,
  SelectorInputConf,
  Selector,
  BECCACCINO_REDUCER_NAME,
} from '@lib/redux-http';
import Beccaccino from '@lib/Beccaccino';

const requestsOrUndefined = (selector: Selector, selectorInput: SelectorInput) => {
  const selectorResult = selector(selectorInput);
  return selectorResult && selectorResult.length === 0 ? undefined : selectorResult;
};

export const beccaccinoSelector = (input: BaseSelectorInput): Array<SelectorOutput | any> => {
  const defaultMapper = (metadata: any, r: any): SelectorOutput => ({
    metadata,
    result: r.response,
  });

  const mapperToApply = input.responseMapper || defaultMapper;

  const beccaccinoState = input.state[BECCACCINO_REDUCER_NAME];

  const allRequestIdsForEndpoint = Beccaccino.getRequestsLog({
    sessionId: input.sessionId,
    endpoint: input.endpointName,
  });
  const requestIdsForEndpoint = allRequestIdsForEndpoint &&
    allRequestIdsForEndpoint.slice(
      ...(input.limit > 0 ? [0, input.limit] : [input.limit, undefined]),
    );
  if (!requestIdsForEndpoint) return null;

  const requestsMetadata = beccaccinoState.requestsMetadata || {};
  const results = beccaccinoState.results || {};
  return requestIdsForEndpoint.map((id: any) => mapperToApply(requestsMetadata[id], results[id]));
};

export const takeNext = (selector: Selector, conf: SelectorInputConf) => {
  // If the default session is specified, the selector will initialize the last request id now
  const lastRequestId = conf.useDefaultSession ?
  Beccaccino.getLastDispatchedRequestId({ endpoint: conf.endpointName })
  : undefined;

  return {
    select: (state: any, sessionId? : string) => {
      // We wait for your sessionId
      if (!conf.useDefaultSession && !sessionId) return undefined;
      if (!lastRequestId) return requestsOrUndefined(selector, { ...conf, state, sessionId });
      return requestsOrUndefined(selector, { ...conf, state, sessionId });
    },
  };
};

export const resultSelector = (input: SelectorInput): Array<any> => beccaccinoSelector({
  ...input,
  responseMapper: (_, r: any) => r ? r.response : undefined,
});

export const errorSelector = (input: SelectorInput): Array<any> => beccaccinoSelector({
  ...input,
  responseMapper: (meta: any, r: any) => (
    { error: !meta.success, response: r ? r.response : undefined }
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
