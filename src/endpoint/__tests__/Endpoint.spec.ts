import { Endpoint } from '@lib/endpoint';
import {
  REDUX_HTTP_CLIENT_REQUEST,
  REDUX_HTTP_ACTION_SIGNATURE
} from '@lib/redux-http';
import axios from 'axios';
import requestHandler from '@lib/endpoint/requestHandler';

jest.mock(
  '@lib/endpoint/requestHandler',
  () => {
    return {
      default: jest.fn(() => ({})),
    };
  }
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
      signature: REDUX_HTTP_ACTION_SIGNATURE
    });
    expect(action).toBeInstanceOf(Function);
  });

  describe('BindedAction', () => {
    it('builds a request handler', () => {
      const action = Endpoint.bindAction({
        config: {
          path: 'http://api.example.com/foos/:id',
          method: 'get',
          name: 'getFoo',
        },
        actionName: REDUX_HTTP_CLIENT_REQUEST,
        axiosInstance: axios.create({}),
        signature: REDUX_HTTP_ACTION_SIGNATURE
      });

      action({ urlParams: { id: 42 }, requestPayload: { foo: 'bar' } });
      expect(requestHandler.mock.calls[0][0]).toMatchObject({
        requestConfiguration: {
          method: 'get',
          url: 'http://api.example.com/foos/42',
          data: { foo: 'bar' },
        },
      });
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
        signature: REDUX_HTTP_ACTION_SIGNATURE
      });
      expect(action({})).toEqual({
        type: REDUX_HTTP_CLIENT_REQUEST,
        signature: REDUX_HTTP_ACTION_SIGNATURE,
        requestDetails: {
          urlParams: {},
          requestPayload: {},
          endpointName: 'getFoo',
          requestId: expect.any(String),
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
        signature: REDUX_HTTP_ACTION_SIGNATURE
      });
      const urlParams = { id: 42 };
      expect(action({ urlParams })).toEqual({
        type: REDUX_HTTP_CLIENT_REQUEST,
        signature: REDUX_HTTP_ACTION_SIGNATURE,
        requestDetails: {
          urlParams,
          requestPayload: {},
          endpointName: 'getFoo',
          requestId: expect.any(String),
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
        signature: REDUX_HTTP_ACTION_SIGNATURE
      });
      const requestPayload = { foo: 'bar' };
      expect(action({ requestPayload })).toEqual({
        type: REDUX_HTTP_CLIENT_REQUEST,
        signature: REDUX_HTTP_ACTION_SIGNATURE,
        requestDetails: {
          urlParams: {},
          requestPayload,
          endpointName: 'getFoo',
          requestId: expect.any(String),
        },
        execAsync: expect.any(Object),
      });
    });
  });
});
