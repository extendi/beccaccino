import {
  REDUX_HTTP_CLIENT_REDUCER_NAME,
  reduxHttpClientSelector,
  takeLatest,
  resultSelector,
  errorSelector,
} from '@lib/redux-http';

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
  it('Returns the request and metadata for an existing endpoint with limit of 2', () => {
    const result = reduxHttpClientSelector({
      state: {
        ...baseState,
        [REDUX_HTTP_CLIENT_REDUCER_NAME]: {
          ...baseState[REDUX_HTTP_CLIENT_REDUCER_NAME],
          requests: {
            ...baseState[REDUX_HTTP_CLIENT_REDUCER_NAME].requests,
            testEndpoint: [
              ...baseState[REDUX_HTTP_CLIENT_REDUCER_NAME].requests.testEndpoint,
              {
                requestDetails: {
                  requestId: 'request2',
                },
                rawResponse: {},
                response: { data: ['test2'] },
              },
              {
                requestDetails: {
                  requestId: 'request3',
                },
                rawResponse: {},
                response: { data: ['test3'] },
              },
            ],
          },
          requestsMetadata: {
            request1: {
              isLoading: false,
              success: true,
            },
            request2: {
              isLoading: true,
              success: false,
            },
            request3: {
              isLoading: false,
              success: true,
            },
          },
        },
      },
      endpointName: 'testEndpoint',
      limit: 2,
    });
    expect(result).toEqual([
      {
        result: { data: ['test'] },
        metadata: {
          isLoading: false,
          success: true,
        },
      },
      {
        result: { data: ['test2'] },
        metadata: {
          isLoading: true,
          success: false,
        },
      },
    ]);
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

describe('resultSelector', () => {
  it('Returns all the results of endpoint', () => {
    const result = resultSelector({
      endpointName: 'testEndpoint',
      state: baseState,
    });
    expect(result).toEqual([
      { data: ['test'] },
    ]);
  });
});

describe('takeLatest decorator', () => {
  it('Returns undefined if the requests are the same across different calls of selector', () => {
    const configuredSelector = takeLatest(
      resultSelector, { limit: -1, endpointName: 'testEndpoint' },
    );
    const firstResult = configuredSelector.select(baseState);
    const secondResult = configuredSelector.select(baseState);
    expect(firstResult).toEqual(secondResult);
  });

  it('Returns the new request added after the firstr call of selector', () => {
    const configuredSelector = takeLatest(
      resultSelector, { limit: -1, endpointName: 'testEndpoint' },
    );
    const firstResult = configuredSelector.select(baseState);
    const enrichedState = {
      ...baseState,
      [REDUX_HTTP_CLIENT_REDUCER_NAME]: {
        ...baseState[REDUX_HTTP_CLIENT_REDUCER_NAME],
        requests: {
          ...baseState[REDUX_HTTP_CLIENT_REDUCER_NAME].requests,
          testEndpoint: [
            ...baseState[REDUX_HTTP_CLIENT_REDUCER_NAME].requests.testEndpoint,
            {
              requestDetails: {
                requestId: 'request2',
              },
              rawResponse: {},
              response: { data: ['test2'] },
            },
          ],
        },
        requestsMetadata: {
          request1: {
            isLoading: false,
            success: true,
          },
          request2: {
            isLoading: true,
            success: false,
          },
        },
      },
    };
    const secondResult = configuredSelector.select(enrichedState);
    expect(firstResult).toBeUndefined();
    expect(secondResult).toEqual([{ data: ['test2'] }]);
  });
});

describe('errorSelector', () => {
  it('Returns all the errors of endpoint calls', () => {
    const errors = errorSelector({
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
    expect(errors).toEqual([
      { error: false, response: { data: ['test'] } },
    ]);
  });
});
