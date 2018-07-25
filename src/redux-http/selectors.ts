import {
  SelectorInput,
  BaseSelectorInput,
  SelectorOutput,
  SelectorInputConf,
  Selector,
  REDUX_HTTP_CLIENT_REDUCER_NAME
} from '@lib/redux-http';

export const reduxHttpClientSelector = (input: BaseSelectorInput): Array<SelectorOutput | any> => {
  const defaultMapper = (metadata: any, r: any): SelectorOutput => ({
    metadata,
    result: r,
  });

  const mapperToApply = input.responseMapper || defaultMapper;
  const stateSlice = input.state[REDUX_HTTP_CLIENT_REDUCER_NAME].requests[input.endpointName];
  const responseSlice =  stateSlice && stateSlice.slice(...(input.limit > 0 ? [0, input.limit] : [input.limit, undefined]));
  if (!responseSlice) return null;
  const metadataForEndpoint = input.state[REDUX_HTTP_CLIENT_REDUCER_NAME].requestsMetadata || {};
  return responseSlice.map(
    (r: any) => mapperToApply(metadataForEndpoint[r.requestDetails.requestId], r.response),

  );
};

export const takeNext = (selector: Selector, conf: SelectorInputConf) => {
  let counter: number = undefined;

  return {
    select: (state: any) => {
      const stateSlice = state[REDUX_HTTP_CLIENT_REDUCER_NAME].requests[conf.endpointName];
      const currentCounter = stateSlice && stateSlice.length;
      if (!counter) counter = currentCounter;

      if (currentCounter && currentCounter > counter) {
        return selector({ ...conf, state });
      }

      return undefined;
    },
  };
};

export const resultSelector = (input: SelectorInput): Array<any> => reduxHttpClientSelector({
  ...input,
  responseMapper: (_, r: any) => r,
});

export const errorSelector = (input: SelectorInput): Array<any> => reduxHttpClientSelector({
  ...input,
  responseMapper: (meta: any, r: any) => ({ error: !meta.success, response: r }),
});

export const loadingSelector = (input: SelectorInput): Array<boolean> => reduxHttpClientSelector({
   ...input,
  responseMapper: (meta: any, _) => meta.isLoading,
});
