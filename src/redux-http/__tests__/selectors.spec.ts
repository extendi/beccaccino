import {
  BECCACCINO_REDUCER_NAME,
  beccaccinoSelector,
  resultSelector,
  errorSelector,
  loadingSelector,
  cancelTokenSelector,
} from '../';
import { defaultSession } from '../../Beccaccino';

const baseState = {
  [BECCACCINO_REDUCER_NAME]: {
    results: {
      request1: {
        requestDetails: {
          requestId: 'request1',
        },
        rawResponse: {},
        response: { data: ['test'] },
      },
    },
    requestsLog: {
      [defaultSession]: {
        testEndpoint: {
          requests: ['request1'],
        },
      },
    },
  },
};

describe('state selectors', () => {
  describe('beccaccinoSelector', () => {
    it('Returns undefined if endpoint is not defined or without requests', () => {
      const result = beccaccinoSelector({
        state: {
          ...baseState,
          [BECCACCINO_REDUCER_NAME]: {
            ...baseState[BECCACCINO_REDUCER_NAME],
            requestsMetadata: {
              missingEndpoint: {
                isLoading: false,
                success: true,
              },
            },
          },
        },
        endpointName: 'missingEndpoint',
      });
      expect(result).toBeNull();
    });
  });
  it('Returns the request and metadata for an existing endpoint', () => {
    baseState[BECCACCINO_REDUCER_NAME].requestsLog['session1'] = {
      testEndpoint: {
        requests: ['request1'],
      },
    };
    const result = beccaccinoSelector({
      state: {
        ...baseState,
        [BECCACCINO_REDUCER_NAME]: {
          ...baseState[BECCACCINO_REDUCER_NAME],
          requestsMetadata: {
            request1: {
              isLoading: false,
              success: true,
            },
          },
        },
      },
      endpointName: 'testEndpoint',
      sessionId: 'session1',
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
    baseState[BECCACCINO_REDUCER_NAME].requestsLog['session2'] = {
      testEndpoint: {
        requests: ['request1', 'request2', 'request3'],
      },
    };
    const result = beccaccinoSelector({
      state: {
        ...baseState,
        [BECCACCINO_REDUCER_NAME]: {
          ...baseState[BECCACCINO_REDUCER_NAME],
          results: {
            ...baseState[BECCACCINO_REDUCER_NAME].results,
            request2: {
              requestDetails: {
                requestId: 'request2',
              },
              rawResponse: {},
              response: { data: ['test2'] },
            },
            request3: {
              requestDetails: {
                requestId: 'request3',
              },
              rawResponse: {},
              response: { data: ['test3'] },
            },
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
      sessionId:'session2',
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
    const result = beccaccinoSelector({
      state: baseState,
      endpointName: 'testEndpoint',
      limit: 1,
    });
    expect(result).toEqual([{
      result: { data: ['test'] },
      metadata: undefined,
    }]);
  });

  it('Applies the map with custom function', () => {
    const result = beccaccinoSelector({
      state: {
        ...baseState,
        [BECCACCINO_REDUCER_NAME]: {
          ...baseState[BECCACCINO_REDUCER_NAME],
          requestsMetadata: {
            request1: {
              isLoading: false,
              success: true,
            },
          },
        },
      },
      endpointName: 'testEndpoint',
      responseMapper: (meta: any, result: any) => (
        { foo: result.response.data, bar: meta.isLoading }
      ),
    });
    expect(result).toEqual([{
      foo: ['test'],
      bar: false,
    }]);
  });

  it('Returns undefined if there are no requests made for the endpoint', () => {
    const result = beccaccinoSelector({
      limit: -1,
      endpointName: 'testEndpoint2',
      state: baseState,
    });
    expect(result).toBeNull();
  });

  it('Returns undefined for a non existing session', () => {
    const result = beccaccinoSelector({
      limit: -1,
      endpointName: 'testEndpoint',
      sessionId: 'this-session-dows-not-exist',
      state: baseState,
    });

    expect(result).toBeNull();
  });

  it('Returns undefined if there are no requests made for the endpoint for the given session', () => {
    baseState[BECCACCINO_REDUCER_NAME].requestsLog['session2'] = {
      testEndpoint: {
        requests: [],
      },
    };
    const result = beccaccinoSelector({
      limit: -1,
      endpointName: 'testEndpoint',
      sessionId: 'session2t',
      state: baseState,
    });

    expect(result).toBeNull();
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

  describe('errorSelector', () => {
    it('Returns all the errors of endpoint calls', () => {
      const errors = errorSelector({
        state: {
          ...baseState,
          [BECCACCINO_REDUCER_NAME]: {
            ...baseState[BECCACCINO_REDUCER_NAME],
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
    it('Does not return errors when meta.success is undefined (i.e. request is in progress)', () => {
      baseState[BECCACCINO_REDUCER_NAME].requestsLog['session5'] = {
        testEndpoint: {
          requests: ['request1', 'request2'],
        },
      };
      const errors = errorSelector({
        state: {
          ...baseState,
          [BECCACCINO_REDUCER_NAME]: {
            ...baseState[BECCACCINO_REDUCER_NAME],
            results: {
              ...baseState[BECCACCINO_REDUCER_NAME].results,
              request1: {
                requestDetails: {
                  requestId: 'request1',
                },
                rawResponse: {},
                response: { data: ['test1'] },
              },
            },
            requestsMetadata: {
              request1: {
                isLoading: false,
                success: true,
              },
              request2: {
                isLoading: true,
              },
            },
          },
        },
        endpointName: 'testEndpoint',
        sessionId: 'session5',
        limit: -1,
      });
      expect(errors).toEqual([
        { error: false, response: undefined },
      ]);
    });
  });

  describe('loadingSelector', () => {
    it('Returns all the loading endpoint calls', () => {
      baseState[BECCACCINO_REDUCER_NAME].requestsLog['session5'] = {
        testEndpoint: {
          requests: ['request1', 'request2'],
        },
      };
      const loading = loadingSelector({
        state: {
          ...baseState,
          [BECCACCINO_REDUCER_NAME]: {
            ...baseState[BECCACCINO_REDUCER_NAME],
            results: {
              ...baseState[BECCACCINO_REDUCER_NAME].results,
              request2: {
                requestDetails: {
                  requestId: 'request2',
                },
                rawResponse: {},
                response: { data: ['test2'] },
              },
            },
            requestsMetadata: {
              request1: {
                isLoading: true,
                success: false,
              },
              request2: {
                isLoading: false,
                success: true,
              },
            },
          },
        },
        endpointName: 'testEndpoint',
        sessionId: 'session5',
      });
      expect(loading).toEqual([true, false]);
    });
  });

  describe('cancelTokenSelector', () => {
    it('Returns the cancel token', () => {
      const cancelCallback = () => 'cancelRequest';
      const params = {
        state: {
          ...baseState,
          [BECCACCINO_REDUCER_NAME]: {
            ...baseState[BECCACCINO_REDUCER_NAME],
            results: {
              ...baseState[BECCACCINO_REDUCER_NAME].results,
              request1: {
                ...baseState[BECCACCINO_REDUCER_NAME].results['request1'],
                requestDetails: {
                  cancelRequest: cancelCallback,
                },
              },
            },
          },
        },
        limit: 1,
        endpointName: 'testEndpoint',
      };
      const cancelToken = cancelTokenSelector(params);

      expect(cancelToken).toEqual([cancelCallback]);
    });
  });
});
