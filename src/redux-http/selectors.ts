import { SelectorInput, BaseSelectorInput, SelectorOutput, REDUX_HTTP_CLIENT_REDUCER_NAME } from '@lib/redux-http';

export const reduxHttpClientSelector = (input: BaseSelectorInput): Array<SelectorOutput | any> => {
  const defaultMapper = (metadata: any, r: any): SelectorOutput => ({
    metadata,
    result: r,
  });

  const mapperToApply = input.responseMapper || defaultMapper;
  const responseSlice = input.state[REDUX_HTTP_CLIENT_REDUCER_NAME].requests[input.endpointName] &&
    input.state[REDUX_HTTP_CLIENT_REDUCER_NAME].requests[input.endpointName].slice(0, input.limit);
  if (!responseSlice) return null;
  const metadataForEndpoint = input.state[REDUX_HTTP_CLIENT_REDUCER_NAME].requestsMetadata || {};
  return responseSlice.map(
    (r: any) => mapperToApply(metadataForEndpoint[r.requestDetails.requestId], r.response),

  );
};
