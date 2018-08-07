import {
  REDUX_HTTP_CLIENT_RESPONSE,
  REDUX_HTTP_CLIENT_ERROR,
  REDUX_HTTP_CLIENT_REQUEST,
  beccaccinoReducer,
} from '@lib/redux-http';
import { defaultSession } from '@lib/Beccaccino';

const initialState = {
  results: {},
  requestsMetadata: {},
  requestsLog: { [defaultSession]: {} },
};

describe('Redux Http reducer', () => {
  it('handles REDUX_HTTP_CLIENT_REQUEST', () => {
    const requestDetails = {
      urlParams: {
        foo: 'bar',
      },
      requestPayload: 'some payload here!',
      endpointName: 'getSomething',
      requestId: 'some kickass uuid',
    };
    const action = {
      requestDetails,
      type: REDUX_HTTP_CLIENT_REQUEST,
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
      requestsLog: {
        [defaultSession]: {
          getSomething: {
            requests: ['some kickass uuid'],
          },
        },
      },
    });
  });
  it('handles REDUX_HTTP_CLIENT_RESPONSE', () => {
    const requestDetails = {
      urlParams: {
        foo: 'bar',
      },
      requestPayload: 'some payload here!',
      endpointName: 'getSomething',
      requestId: 'some kickass uuid',
    };
    const action = {
      requestDetails,
      type: REDUX_HTTP_CLIENT_RESPONSE,
      response: {
        rawResponse: 'the raw result',
        data: 'the response',
        success: true,
      },
    };
    const nextState = beccaccinoReducer(
      { results: {}, requestsMetadata: {}, requestsLog: { [defaultSession]: {} } },
      action,
    );
    expect(nextState).toEqual({
      results: {
        'some kickass uuid': {
          requestDetails,
          rawResponse: 'the raw result',
          response: 'the response',
        },
      },
      requestsMetadata: {
        [requestDetails.requestId]: {
          isLoading: false,
          success: true,
        },
      },
      requestsLog: {
        [defaultSession]: { },
      },
    });
  });
  it('handles REDUX_HTTP_CLIENT_ERROR', () => {
    const requestDetails = {
      urlParams: {
        foo: 'bar',
      },
      requestPayload: 'some payload here!',
      endpointName: 'getSomething',
      requestId: 'some kickass uuid',
    };
    const action = {
      requestDetails,
      type: REDUX_HTTP_CLIENT_ERROR,
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
        'some kickass uuid': {
          requestDetails,
          rawResponse: 'the raw error',
          response: 'the error',
        },
      },
      requestsMetadata: {
        [requestDetails.requestId]: {
          isLoading: false,
          success: false,
        },
      },
      requestsLog: {
        [defaultSession]: { },
      },
    });
  });
  it('returns the input state for other action types', () => {
    const requestDetails = {
      urlParams: {
        foo: 'bar',
      },
      requestPayload: 'some payload here!',
      endpointName: 'getSomething',
    };
    const action = {
      requestDetails,
      type: 'SOME_ACTION',
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
      someKey: 'some value',
    });
  });
});
