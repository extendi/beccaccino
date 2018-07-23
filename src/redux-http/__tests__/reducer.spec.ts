import {
  REDUX_HTTP_CLIENT_RESPONSE,
  REDUX_HTTP_CLIENT_ERROR,
  REDUX_HTTP_CLIENT_REQUEST,
  reduxHttpReducer,
} from '@lib/redux-http';

const initialState = {
  requests: {},
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
    const nextState = reduxHttpReducer(initialState, action);
    expect(nextState).toEqual({
      requests: {},
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
    const nextState = reduxHttpReducer(
      { requests: {}, requestsMetadata: {} },
      action,
    );
    expect(nextState).toEqual({
      requests: {
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
    const nextState = reduxHttpReducer(
      undefined,
      action,
    );
    expect(nextState).toEqual({
      requests: {
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
    const nextState = reduxHttpReducer(
      { requests: {}, someKey: 'some value' },
      action,
    );
    expect(nextState).toEqual({
      requests: {},
      someKey: 'some value'
    });
  })
});
