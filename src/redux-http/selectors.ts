import {
  SelectorInput,
  BaseSelectorInput,
  SelectorOutput,
  SelectorInputConf,
  Selector,
  BECCACCINO_REDUCER_NAME
} from '@lib/redux-http';
import Beccaccino from '@lib/Beccaccino';

const requestsOrUndefined = (selector: Selector, selectorInput: SelectorInput) => {
  const selectorResult = selector(selectorInput);
  return selectorResult && selectorResult.length === 0 ? undefined : selectorResult;
};

export const RESULT = 'BECCACCINO:SELECTORS:RESULT';
export const ERROR = 'BECCACCINO:SELECTORS:ERROR';
export const LOADING = 'BECCACCINO:SELECTORS:LOADING';
export const CANCEL_TOKEN = 'BECCACCINO:SELECTORS:CANCEL_TOKEN';

export const resultSelector = (input: SelectorInput): Array<any> => beccaccinoSelector({
  ...input,
  responseMapper: (_, r: any) => r ? r.response : undefined,
});
export const errorSelector = (input: SelectorInput): Array<any> => beccaccinoSelector({
  ...input,
  responseMapper: (meta: any, r: any) => ({ error: !meta.success, response: r ? r.response : undefined }),
});
export const loadingSelector = (input: SelectorInput): Array<boolean> => beccaccinoSelector({
  ...input,
  responseMapper: (meta: any, _) => meta.isLoading,
});
export const cancelTokenSelector = (input: SelectorInput): Array<boolean> => beccaccinoSelector({
  ...input,
  responseMapper: (_, r: any) => r ? r.requestDetails.cancelRequest : undefined,
});

const selectorsMap: any = {
  [RESULT]: {
    selector: resultSelector,
    sliceOffset: 1,
  },
  [ERROR]: {
    selector: errorSelector,
    sliceOffset: 1,
  },
  [LOADING]: {
    selector: loadingSelector,
    sliceOffset: 0,
  },
  [CANCEL_TOKEN]: {
    selector: cancelTokenSelector,
    sliceOffset: 0,
  },
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
    allRequestIdsForEndpoint.slice(...(input.limit > 0 ? [0, input.limit] : [input.limit, undefined]));

  if (!requestIdsForEndpoint) return null;

  const requestsMetadata = beccaccinoState.requestsMetadata || {};
  const results = beccaccinoState.results || {};
  return requestIdsForEndpoint.map((id: any) => mapperToApply(requestsMetadata[id], results[id]));
};

export const takeLast = (selectorName: string, conf: SelectorInputConf) => {
  const takeNextSelector = takeNext(selectorName, conf);

  return {
    select: (state: any) => {
      const selectorResult = takeNextSelector.select(state);
      console.log(selectorResult);
      takeNextSelector.refresh();
      return selectorResult;
    }
  }
}

export const takeNext = (selectorName: string, conf: SelectorInputConf) => {
  const { selector, sliceOffset } = selectorsMap[selectorName];
  if (!selector || sliceOffset === undefined) throw Error(`Unknown selector ${selectorName}!`);

  return takeNextWithOffset(selector, conf, sliceOffset);
}

const takeNextWithOffset = (selector: Selector, conf: SelectorInputConf, sliceOffset: number = 0) => {
  const refresh = () => Beccaccino.getLastDispatchedRequestId({ endpoint: conf.endpointName });
  let lastRequestId = refresh();

  return {
    select: (state: any) => {
      console.log('last req id ', conf.endpointName, lastRequestId);
      if (!lastRequestId) return requestsOrUndefined(selector, { ...conf, state });

      const requestIdsForEndpoint = state[BECCACCINO_REDUCER_NAME].requestsLog[conf.endpointName];
      const lastRequestIndex = requestIdsForEndpoint.findIndex((id: string) => id === lastRequestId);
      const nextRequestIds = requestIdsForEndpoint.slice(lastRequestIndex + sliceOffset);
      console.log('next req id ', conf.endpointName, nextRequestIds);
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
    refresh: () => { console.log('called with ', conf.endpointName); console.log(lastRequestId); lastRequestId = refresh(); console.log(lastRequestId); },
  };
};
