import {
  REDUX_HTTP_CLIENT_RESPONSE,
  REDUX_HTTP_CLIENT_ERROR,
  reduxHttpReducer,
} from '@lib/redux-http';

describe('Redux Http reducer', () => {
  it('handles REDUX_HTTP_CLIENT_RESPONSE', () => {
    const requestDetails = {
      urlParmas: {
        foo: 'bar'
      },
      requestPayload: 'some payload here!',
      endpointName: 'getSomething',
    };
    const action = {
      type: REDUX_HTTP_CLIENT_RESPONSE,
      requestDetails,
      response: {
        rawResponse: 'the raw result',
        data: 'the response',
      },
    };
    const nextState = reduxHttpReducer(
      { requests: {} },
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
    });
  });
  it('handles REDUX_HTTP_CLIENT_ERROR', () => {
    const requestDetails = {
      urlParmas: {
        foo: 'bar'
      },
      requestPayload: 'some payload here!',
      endpointName: 'getSomething',
    };
    const action = {
      type: REDUX_HTTP_CLIENT_ERROR,
      requestDetails,
      response: {
        rawResponse: 'the raw error',
        data: 'the error',
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
    });
  });
  it('returns the input state for other action types', () => {
    const requestDetails = {
      urlParmas: {
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
    expect(nextState).toEqual({ requests: {}, someKey: 'some value' });
  })
});
