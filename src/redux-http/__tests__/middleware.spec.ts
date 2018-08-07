import {
  beccaccinoMiddleware,
  REDUX_HTTP_ACTION_SIGNATURE,
  REDUX_HTTP_CLIENT_REQUEST,
  REDUX_HTTP_CLIENT_RESPONSE,
  REDUX_HTTP_CLIENT_ERROR,
} from '@lib/redux-http';
import Beccaccino from '@lib/Beccaccino';

Beccaccino.configure({}, []);

const nextSpyMock = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('Http Client Middleware', () => {
  it('does not handle unsigned actions', () => {
    const action = {
      type: REDUX_HTTP_CLIENT_REQUEST,
      payload: 'not interesting',
      execAsync: new Promise((resolve, reject) => resolve('asd')),
    };

    const result = beccaccinoMiddleware(null)(nextSpyMock)(action);
    expect(result).toBeUndefined();
    expect(nextSpyMock).toHaveReturnedTimes(1);
    expect(nextSpyMock).toHaveBeenCalledWith(action);
  });
  it('does not handle unrecognised action types', () => {
    const action = {
      type: 'NOT_MY_TYPE',
      payload: 'some stuff here',
      signature: REDUX_HTTP_ACTION_SIGNATURE,
      execAsync: new Promise((resolve, reject) => resolve('asd') || reject('foo')),
    };

    const result = beccaccinoMiddleware(null)(nextSpyMock)(action);
    expect(result).toBeUndefined();
    expect(nextSpyMock).toHaveReturnedTimes(1);
    expect(nextSpyMock).toHaveBeenCalledWith(action);
  });
  it('does not handle actions without execAsync', () => {
    const action = {
      type: REDUX_HTTP_CLIENT_REQUEST,
      payload: 'some stuff here',
      signature: REDUX_HTTP_ACTION_SIGNATURE,
    };

    const result = beccaccinoMiddleware(null)(nextSpyMock)(action);
    expect(result).toBeUndefined();
    expect(nextSpyMock).toHaveReturnedTimes(1);
    expect(nextSpyMock).toHaveBeenCalledWith(action);
  });
  it('does not handle actions without execAsync as Promise', () => {
    const action = {
      type: REDUX_HTTP_CLIENT_REQUEST,
      payload: 'some stuff here',
      signature: REDUX_HTTP_ACTION_SIGNATURE,
      execAsync: 'asd asd',
    };

    const result = beccaccinoMiddleware(null)(nextSpyMock)(action);
    expect(result).toBeUndefined();
    expect(nextSpyMock).toHaveReturnedTimes(1);
    expect(nextSpyMock).toHaveBeenCalledWith(action);
  });
  it('dispatches a REDUX_HTTP_CLIENT_REQUEST with binded request details payload', () => {
    const requestDetails = {
      urlParmas: {
        foo: 'bar',
      },
      requestPayload: 'some payload here!',
      endpointName: 'getSomething',
    };
    const action = {
      requestDetails,
      type: REDUX_HTTP_CLIENT_REQUEST,
      signature: REDUX_HTTP_ACTION_SIGNATURE,
      execAsync: new Promise((resolve, reject) => resolve('asd')),
    };

    beccaccinoMiddleware(null)(nextSpyMock)(action);
    expect(nextSpyMock).toHaveReturnedTimes(1);
    expect(nextSpyMock).toHaveBeenCalledWith({
      requestDetails,
      type: REDUX_HTTP_CLIENT_REQUEST,
    });
  });
  it('dispatches a REDUX_HTTP_CLIENT_RESPONSE when execAsync promise resolves', () => {
    expect.assertions(2);
    const requestDetails = {
      urlParmas: {
        foo: 'bar',
      },
      requestPayload: 'some payload here!',
      endpointName: 'getSomething',
    };
    const action = {
      requestDetails,
      type: REDUX_HTTP_CLIENT_REQUEST,
      signature: REDUX_HTTP_ACTION_SIGNATURE,
      execAsync: Promise.resolve('the result'),
    };

    beccaccinoMiddleware(null)(nextSpyMock)(action);
    action.execAsync.then((result) => {
      expect(nextSpyMock).toHaveBeenCalledTimes(2);
      expect(nextSpyMock).lastCalledWith({
        requestDetails,
        type: REDUX_HTTP_CLIENT_RESPONSE,
        response: result,
      });
    }).catch(errors => errors);
  });
  it('dispatches a REDUX_HTTP_CLIENT_ERROR when execAsync promise fails', () => {
    const requestDetails = {
      urlParmas: {
        foo: 'bar',
      },
      requestPayload: 'some payload here!',
      endpointName: 'getSomething',
    };
    const action = {
      requestDetails,
      type: REDUX_HTTP_CLIENT_REQUEST,
      signature: REDUX_HTTP_ACTION_SIGNATURE,
      execAsync: Promise.reject('the error'),
    };

    beccaccinoMiddleware(null)(nextSpyMock)(action);
    action.execAsync.then(response => response).catch((errors) => {
      expect(nextSpyMock).toHaveBeenCalledTimes(2);
      expect(nextSpyMock).lastCalledWith({
        requestDetails,
        type: REDUX_HTTP_CLIENT_ERROR,
        response: errors,
      });
    });
  });
  it('stores the last request id into metadata of beccaccino instance', () => {
    const requestDetails = {
      urlParmas: {
        foo: 'bar',
      },
      requestPayload: 'some payload here!',
      endpointName: 'getSomething',
      requestId: 'last',
    };
    const action = {
      requestDetails,
      type: REDUX_HTTP_CLIENT_REQUEST,
      signature: REDUX_HTTP_ACTION_SIGNATURE,
      execAsync: Promise.resolve('the payload'),
    };
    beccaccinoMiddleware(null)(nextSpyMock)(action);
    const id = Beccaccino.getClientInstance().sessionManager
      .getLastDispatchedRequestId({ endpointId: 'getSomething' });
    expect(id).toEqual('last');
  });
});
