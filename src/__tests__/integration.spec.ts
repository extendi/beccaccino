import {
  Beccaccino,
  beccaccinoMiddleware,
  beccaccinoReducer,
  BECCACCINO_REDUCER_NAME,
} from '@lib/index';

import {
  createStore,
  combineReducers,
  applyMiddleware,
} from 'redux';

const store = createStore(
  combineReducers({
    [BECCACCINO_REDUCER_NAME]: beccaccinoReducer,
  }),
  {},
  applyMiddleware(beccaccinoMiddleware),
);

const client = Beccaccino.configure(
  {
    baseURL: 'http://www.mocky.io/v2',
    headers: {
      'Content-type': 'application/json',
      Accept: 'application/json',
    },
  },
  [
    { name: 'getRequest', path: '/:id', method: 'get' },
  ],
);

describe('Integration tests with redux', () => {
  it('store default state in redux http reducer', () => {
    expect(store.getState()).toEqual({
      [BECCACCINO_REDUCER_NAME]: {
        results: {},
        requestsMetadata: {},
      },
    });
  });
});

describe('when http action is dispatched the middleware', () => {
  const action1 = client.getRequest({ urlParams: { id: '5b589b113000002f27fe5005' } });
  const action2 = client.getRequest({ urlParams: { id: '5b589ccf3000000923fe500c' } });

  it('store first request result', async (done) => {
    expect.assertions(1);
    store.dispatch(action1);
    await action1.execAsync;
    const state = store.getState();
    expect(state).toMatchObject({
      [BECCACCINO_REDUCER_NAME]: {
        results: {
          [action1.requestDetails.requestId]: {
            requestDetails: {
              urlParams: { id: '5b589b113000002f27fe5005' },
              requestPayload: {},
              endpointName: 'getRequest',
              requestId: action1.requestDetails.requestId,
              cancelRequest: action1.requestDetails.cancelRequest,
            },
            response: {
              id: 1,
              test: true,
            },
          },
        },
        requestsMetadata: {
          [action1.requestDetails.requestId]: {
            isLoading: false,
            success: true,
          },
        },
      },
    });
    done();
  });

  it('store the second request result', async (done) => {
    expect.assertions(1);
    store.dispatch(action2);
    await action2.execAsync;
    const state = store.getState();
    expect(state).toMatchObject({
      [BECCACCINO_REDUCER_NAME]: {
        results: {
          [action1.requestDetails.requestId]: {
            requestDetails: {
              urlParams: { id: '5b589b113000002f27fe5005' },
              requestPayload: {},
              endpointName: 'getRequest',
              requestId: action1.requestDetails.requestId,
              cancelRequest: action1.requestDetails.cancelRequest,
            },
            response: {
              id: 1,
              test: true,
            },
          },
          [action2.requestDetails.requestId]: {
            requestDetails: {
              urlParams: { id: '5b589ccf3000000923fe500c' },
              requestPayload: {},
              endpointName: 'getRequest',
              requestId: action2.requestDetails.requestId,
              cancelRequest: action2.requestDetails.cancelRequest,
            },
            response: {
              id: 2,
              test: true,
            },
          },
        },
        requestsMetadata: {
          [action1.requestDetails.requestId]: {
            isLoading: false,
            success: true,
          },
          [action2.requestDetails.requestId]: {
            isLoading: false,
            success: false,
          },
        },
      },
    });
    done();
  });
});
