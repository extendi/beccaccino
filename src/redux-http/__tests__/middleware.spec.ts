import {
  reduxHttpMiddleware,
  REDUX_HTTP_ACTION_SIGNATURE,
  REDUX_HTTP_CLIENT_REQUEST,
  REDUX_HTTP_CLIENT_RESPONSE,
  REDUX_HTTP_CLIENT_ERROR,
} from '@lib/redux-http';

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

    const result = reduxHttpMiddleware(null)(nextSpyMock)(action);
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
    }

    const result = reduxHttpMiddleware(null)(nextSpyMock)(action);
    expect(result).toBeUndefined();
    expect(nextSpyMock).toHaveReturnedTimes(1);
    expect(nextSpyMock).toHaveBeenCalledWith(action);
  });
  it('does not handle actions without execAsync', () => {
    const action = {
      type: REDUX_HTTP_CLIENT_REQUEST,
      payload: 'some stuff here',
      signature: REDUX_HTTP_ACTION_SIGNATURE,
    }

    const result = reduxHttpMiddleware(null)(nextSpyMock)(action);
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
    }

    const result = reduxHttpMiddleware(null)(nextSpyMock)(action);
    expect(result).toBeUndefined();
    expect(nextSpyMock).toHaveReturnedTimes(1);
    expect(nextSpyMock).toHaveBeenCalledWith(action);
  });
  it('dispatches a REDUX_HTTP_CLIENT_REQUEST with binded request details payload', () => {
    const requestDetails = {
      urlParmas: {
        foo: 'bar'
      },
      requestPayload: 'some payload here!',
      endpointName: 'getSomething'
    }
    const action = {
      type: REDUX_HTTP_CLIENT_REQUEST,
      signature: REDUX_HTTP_ACTION_SIGNATURE,
      requestDetails,
      execAsync: new Promise((resolve, reject) => resolve('asd')),
    };

    reduxHttpMiddleware(null)(nextSpyMock)(action);
    expect(nextSpyMock).toHaveReturnedTimes(1);
    expect(nextSpyMock).toHaveBeenCalledWith({
      type: REDUX_HTTP_CLIENT_REQUEST,
      requestDetails
    });
  });
  it('dispatches a REDUX_HTTP_CLIENT_RESPONSE when execAsync promise resolves', () => {
    const requestDetails = {
      urlParmas: {
        foo: 'bar'
      },
      requestPayload: 'some payload here!',
      endpointName: 'getSomething'
    }
    const action = {
      type: REDUX_HTTP_CLIENT_REQUEST,
      signature: REDUX_HTTP_ACTION_SIGNATURE,
      requestDetails,
      execAsync: Promise.resolve('the result'),
    };

    reduxHttpMiddleware(null)(nextSpyMock)(action);
    action.execAsync.then((result) => {
      expect(nextSpyMock).toHaveBeenCalledTimes(2);
      expect(nextSpyMock).lastCalledWith({
        type: REDUX_HTTP_CLIENT_RESPONSE,
        requestDetails,
        response: result,
      });
    }).catch(errors => errors);
  });
  it('dispatches a REDUX_HTTP_CLIENT_ERROR when execAsync promise fails', () => {
    const requestDetails = {
      urlParmas: {
        foo: 'bar'
      },
      requestPayload: 'some payload here!',
      endpointName: 'getSomething'
    }
    const action = {
      type: REDUX_HTTP_CLIENT_REQUEST,
      signature: REDUX_HTTP_ACTION_SIGNATURE,
      requestDetails,
      execAsync: Promise.reject('the error'),
    };

    reduxHttpMiddleware(null)(nextSpyMock)(action);
    action.execAsync.then(response => response).catch((errors) => {
      expect(nextSpyMock).toHaveBeenCalledTimes(2);
      expect(nextSpyMock).lastCalledWith({
        type: REDUX_HTTP_CLIENT_ERROR,
        requestDetails,
        response: errors,
      });
    });
  });
});
