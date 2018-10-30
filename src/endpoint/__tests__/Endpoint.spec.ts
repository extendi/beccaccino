import {
  REDUX_HTTP_CLIENT_REQUEST,
  REDUX_HTTP_ACTION_SIGNATURE,
} from '@lib/redux-http';
import axios from 'axios';
import { Endpoint } from '../';
import { defaultSession } from '../../Beccaccino';
import { requestHandler } from '../requestHandler';

jest.mock(
  '../requestHandler',
  () => {
    return {
      requestHandler: jest.fn(() => ({})),
    };
  },
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('Endpoint.bindAction', () => {
  it('returns a BindedAction', () => {
    const action = Endpoint.bindAction({
      config: {
        path: 'http://api.example.com/foos',
        method: 'get',
        name: 'getFoo',
      },
      actionName: REDUX_HTTP_CLIENT_REQUEST,
      axiosInstance: axios.create({}),
      signature: REDUX_HTTP_ACTION_SIGNATURE,
    });
    expect(action).toBeInstanceOf(Function);
  });

  describe('BindedAction', () => {
    it('builds a request handler with get request', () => {
      const action = Endpoint.bindAction({
        config: {
          path: 'http://api.example.com/foos/:id',
          method: 'get',
          name: 'getFoo',
        },
        actionName: REDUX_HTTP_CLIENT_REQUEST,
        axiosInstance: axios.create({}),
        signature: REDUX_HTTP_ACTION_SIGNATURE,
      });

      action({ urlParams: { id: 42 }, requestPayload: { foo: 'bar' } });
      expect(requestHandler.mock.calls[0][0]).toMatchObject({
        requestConfiguration: {
          method: 'get',
          url: 'http://api.example.com/foos/42',
          params: { foo: 'bar' },
        },
      });
      const cancelToken = requestHandler.mock.calls[0][0].requestConfiguration.cancelToken;
      expect(cancelToken).toBeInstanceOf(axios.CancelToken);
    });
    it('builds a request handler with post request', () => {
      const action = Endpoint.bindAction({
        config: {
          path: 'http://api.example.com/foos/:id',
          method: 'post',
          name: 'postFoo',
        },
        actionName: REDUX_HTTP_CLIENT_REQUEST,
        axiosInstance: axios.create({}),
        signature: REDUX_HTTP_ACTION_SIGNATURE,
      });

      action({
        urlParams: { id: 42 },
        requestPayload: { foo: 'bar' },
        sessionId: 'some-session-id',
      });
      expect(requestHandler.mock.calls[0][0]).toMatchObject({
        requestConfiguration: {
          method: 'post',
          url: 'http://api.example.com/foos/42',
          data: { foo: 'bar' },
        },
      });
      expect(
        requestHandler.mock.calls[0][0]
          .requestConfiguration.cancelToken).toBeInstanceOf(axios.CancelToken);
    });

    it('builds a BindedActionPayload', () => {
      const action = Endpoint.bindAction({
        config: {
          path: 'http://api.example.com/foos',
          method: 'get',
          name: 'getFoo',
        },
        actionName: REDUX_HTTP_CLIENT_REQUEST,
        axiosInstance: axios.create({}),
        signature: REDUX_HTTP_ACTION_SIGNATURE,
      });
      expect(action({ sessionId: 'some-session-id' })).toEqual({
        type: REDUX_HTTP_CLIENT_REQUEST,
        signature: REDUX_HTTP_ACTION_SIGNATURE,
        requestDetails: {
          urlParams: {},
          requestPayload: {},
          endpointName: 'getFoo',
          sessionId: 'some-session-id',
          requestId: expect.any(String),
          cancelRequest: expect.any(Function),
        },
        execAsync: expect.any(Object),
      });
    });
    it('builds a BindedActionPayload with url parmas', () => {
      const action = Endpoint.bindAction({
        config: {
          path: 'http://api.example.com/foos',
          method: 'get',
          name: 'getFoo',
        },
        actionName: REDUX_HTTP_CLIENT_REQUEST,
        axiosInstance: axios.create({}),
        signature: REDUX_HTTP_ACTION_SIGNATURE,
      });
      const urlParams = { id: 42 };
      expect(action({ urlParams })).toEqual({
        type: REDUX_HTTP_CLIENT_REQUEST,
        signature: REDUX_HTTP_ACTION_SIGNATURE,
        requestDetails: {
          urlParams,
          requestPayload: {},
          sessionId: defaultSession,
          endpointName: 'getFoo',
          requestId: expect.any(String),
          cancelRequest: expect.any(Function),
        },
        execAsync: expect.any(Object),
      });
    });
    it('builds a BindedActionPayload with requestPayload', () => {
      const action = Endpoint.bindAction({
        config: {
          path: 'http://api.example.com/foos',
          method: 'get',
          name: 'getFoo',
        },
        actionName: REDUX_HTTP_CLIENT_REQUEST,
        axiosInstance: axios.create({}),
        signature: REDUX_HTTP_ACTION_SIGNATURE,
      });
      const requestPayload = { foo: 'bar' };
      expect(action({ requestPayload })).toEqual({
        type: REDUX_HTTP_CLIENT_REQUEST,
        signature: REDUX_HTTP_ACTION_SIGNATURE,
        requestDetails: {
          requestPayload,
          sessionId: defaultSession,
          urlParams: {},
          endpointName: 'getFoo',
          requestId: expect.any(String),
          cancelRequest: expect.any(Function),
        },
        execAsync: expect.any(Object),
      });
    });
  });
});
