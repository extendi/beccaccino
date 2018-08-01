import {
  REDUX_HTTP_CLIENT_RESPONSE,
  REDUX_HTTP_CLIENT_ERROR,
  REDUX_HTTP_CLIENT_REQUEST,
  beccaccinoReducer,
} from '@lib/redux-http';

const initialState = {
  results: {},
  requestsMetadata: {},
};

describe('Redux Http reducer', () => {
  it('handles REDUX_HTTP_CLIENT_REQUEST', () => {
    const requestDetails = {
      urlParams: {
        foo: 'bar'
      },
      requestPayload: 'some payload here!',
      endpointName: 'getSomething',
      requestId: 'some kickass uuid',
    };
    const action = {
      type: REDUX_HTTP_CLIENT_REQUEST,
      requestDetails,
    };
    const nextState = beccaccinoReducer(initialState, action);
    expect(nextState).toEqual({
      results: {},
      requestsMetadata: {
        [requestDetails.requestId]: {
          isLoading: true,
          success: undefined,
        },
      },
    });
  });
  it('handles REDUX_HTTP_CLIENT_RESPONSE', () => {
    const requestDetails = {
      urlParams: {
        foo: 'bar'
      },
      requestPayload: 'some payload here!',
      endpointName: 'getSomething',
      requestId: 'some kickass uuid',
    };
    const action = {
      type: REDUX_HTTP_CLIENT_RESPONSE,
      requestDetails,
      response: {
        rawResponse: 'the raw result',
        data: 'the response',
        success: true,
      },
    };
    const nextState = beccaccinoReducer(
      { results: {}, requestsMetadata: {} },
      action,
    );
    expect(nextState).toEqual({
      results: {
        getSomething: [
          {
            requestDetails,
            rawResponse: 'the raw result',
            response: 'the response',
          },
        ],
      },
      requestsMetadata: {
        [requestDetails.requestId]: {
          isLoading: false,
          success: true,
        },
      },
    });
  });
  it('handles REDUX_HTTP_CLIENT_ERROR', () => {
    const requestDetails = {
      urlParams: {
        foo: 'bar'
      },
      requestPayload: 'some payload here!',
      endpointName: 'getSomething',
      requestId: 'some kickass uuid',
    };
    const action = {
      type: REDUX_HTTP_CLIENT_ERROR,
      requestDetails,
      response: {
        rawResponse: 'the raw error',
        data: 'the error',
        success: false,
      },
    };
    const nextState = beccaccinoReducer(
      undefined,
      action,
    );
    expect(nextState).toEqual({
      results: {
        getSomething: [
          {
            requestDetails,
            rawResponse: 'the raw error',
            response: 'the error',
          },
        ],
      },
      requestsMetadata: {
        [requestDetails.requestId]: {
          isLoading: false,
          success: false,
        },
      },

    });
  });
  it('returns the input state for other action types', () => {
    const requestDetails = {
      urlParams: {
        foo: 'bar'
      },
      requestPayload: 'some payload here!',
      endpointName: 'getSomething',
    };
    const action = {
      type: 'SOME_ACTION',
      requestDetails,
      response: {
        rawResponse: 'the raw error',
        data: 'the error',
      },
    };
    const nextState = beccaccinoReducer(
      { results: {}, someKey: 'some value' },
      action,
    );
    expect(nextState).toEqual({
      results: {},
      someKey: 'some value'
    });
  })
});
