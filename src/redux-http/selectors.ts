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

  const allRequestIdsForEndpoint = beccaccinoState.requestsLog[input.endpointName];
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
  const lastRequestId = Beccaccino.getLastDispatchedRequestId({ endpoint: conf.endpointName });

  return {
    select: (state: any) => {
      if (!lastRequestId) return requestsOrUndefined(selector, { ...conf, state });

      const requestIdsForEndpoint = state[BECCACCINO_REDUCER_NAME].requestsLog[conf.endpointName];
      const lastRequestIndex = requestIdsForEndpoint.findIndex(
        (id: string) => id === lastRequestId,
      );
      const nextRequestIds = requestIdsForEndpoint.slice(lastRequestIndex + 1);
      const selectorStateInput = {
        ...state,
        [BECCACCINO_REDUCER_NAME]: {
          ...state[BECCACCINO_REDUCER_NAME],
          requestsLog: {
            ...state[BECCACCINO_REDUCER_NAME].requestsLog,
            [conf.endpointName]: nextRequestIds,
          },
        },
      };
      return requestsOrUndefined(selector, { ...conf, state: selectorStateInput });
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
