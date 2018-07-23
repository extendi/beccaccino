import { REDUX_HTTP_CLIENT_REDUCER_NAME, reduxHttpClientSelector } from '@lib/redux-http';

const baseState = {
  [REDUX_HTTP_CLIENT_REDUCER_NAME]: {
    requests: {
      testEndpoint: [
        {
          requestDetails: {
            requestId: 'request1',
          },
          rawResponse: {},
          response: { data: ['test'] },
        },
      ],
    },
  },
};

describe('state selectors', () => {
  describe('reduxHttpClientSelector', () => {
    it('Returns undefined if endpoint is not defined or without requests', () => {
      const result = reduxHttpClientSelector({
        state: {
          ...baseState, requestsMetadata: {
            missingEndpoint: {
              isLoading: false,
              success: true,
            },
          },
        },
        endpointName: 'missingEndpoint',
      });
      expect(result).toBeNull();
    });
  });
  it('Returns the request and metadata for an existing endpoint', () => {
    const result = reduxHttpClientSelector({
      state: {
        ...baseState,
        [REDUX_HTTP_CLIENT_REDUCER_NAME]: {
          ...baseState[REDUX_HTTP_CLIENT_REDUCER_NAME],
          requestsMetadata: {
            request1: {
              isLoading: false,
              success: true,
            },
          },
        },
      },
      endpointName: 'testEndpoint',
    });
    expect(result).toEqual([{
      result: { data: ['test'] },
      metadata: {
        isLoading: false,
        success: true,
      },
    }]);
  });
  it('Returns the request and undefined metadata for an existing endpoint', () => {
    const result = reduxHttpClientSelector({
      state: baseState,
      endpointName: 'testEndpoint',
    });
    expect(result).toEqual([{
      result: { data: ['test'] },
      metadata: undefined,
    }]);
  });

  it('Applies the map with custom function', () => {
    const result = reduxHttpClientSelector({
      state: {
        ...baseState,
        [REDUX_HTTP_CLIENT_REDUCER_NAME]: {
          ...baseState[REDUX_HTTP_CLIENT_REDUCER_NAME],
          requestsMetadata: {
            request1: {
              isLoading: false,
              success: true,
            },
          },
        },
      },
      endpointName: 'testEndpoint',
      responseMapper: (meta: any, response: any) => ({ foo: response.data, bar: meta.isLoading }),
    });
    expect(result).toEqual([{
      foo: ['test'],
      bar: false,
    }]);
  });
});
