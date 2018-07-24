import {
  SelectorInput,
  BaseSelectorInput,
  SelectorOutput,
  Selector,
  REDUX_HTTP_CLIENT_REDUCER_NAME
} from '@lib/redux-http';

export const reduxHttpClientSelector = (input: BaseSelectorInput): Array<SelectorOutput | any> => {
  const defaultMapper = (metadata: any, r: any): SelectorOutput => ({
    metadata,
    result: r,
  });

  const mapperToApply = input.responseMapper || defaultMapper;
  const responseSlice = input.state[REDUX_HTTP_CLIENT_REDUCER_NAME].requests[input.endpointName] &&
    input.state[REDUX_HTTP_CLIENT_REDUCER_NAME].requests[input.endpointName].slice(input.limit > 0 ? 0 : input.limit, input.limit > 0 ? input.limit : undefined); // We will refactor later
  if (!responseSlice) return null;
  const metadataForEndpoint = input.state[REDUX_HTTP_CLIENT_REDUCER_NAME].requestsMetadata || {};
  return responseSlice.map(
    (r: any) => mapperToApply(metadataForEndpoint[r.requestDetails.requestId], r.response),

  );
};

export const takeLatest = (selector: Selector, selectorInput: SelectorInput) => {
  let counter: number = undefined;

  return {
    select: (state: any) => {
      const stateSlice = state[REDUX_HTTP_CLIENT_REDUCER_NAME].requests[selectorInput.endpointName];
      const currentCounter = stateSlice && stateSlice.length;
      if (!counter) counter = currentCounter;

      if (currentCounter && currentCounter > counter) {
        return selector({ ...selectorInput, state });
      }

      return undefined;
    },
  };
};

export const resultSelector = (input: SelectorInput): Array<any> => reduxHttpClientSelector({
  ...input,
  responseMapper: (_, r: any) => r,
});
