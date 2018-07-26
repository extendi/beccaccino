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
        requests: {},
        requestsMetadata: {},
      },
    });
  });
});

describe('when http action is dispatched the middleware', () => {
  it('store first request result', async () => {
    expect.assertions(1);
    const action = client.getRequest({ urlParams: { id: '5b589b113000002f27fe5005' } });
    store.dispatch(action);
    await action.execAsync;
    const state = store.getState();
    expect(state).toMatchObject({
      [BECCACCINO_REDUCER_NAME]: {
        requests: {
          getRequest: [
            {
              requestDetails: {
                urlParams: { id: '5b589b113000002f27fe5005' },
                requestPayload: {},
                endpointName: 'getRequest',
                requestId: action.requestDetails.requestId,
                cancelRequest: action.requestDetails.cancelRequest,
              },
              response: {
                id: 1,
                test: true,
              },
            },
          ],
        },
        requestsMetadata: {
          [action.requestDetails.requestId]: {
            isLoading: false,
            success: true,
          },
        },
      },
    });
  });
  it('store the second request result', async () => {
    expect.assertions(1);
    const action = client.getRequest({ urlParams: { id: '5b589ccf3000000923fe500c' } });
    store.dispatch(action);
    await action.execAsync;
    const state = store.getState();
    expect(state).toMatchObject({
      [BECCACCINO_REDUCER_NAME]: {
        requests: {
          getRequest: [
            {
              requestDetails: {
                urlParams: { id: '5b589b113000002f27fe5005' },
                requestPayload: {},
                endpointName: 'getRequest',
              },
              response: {
                id: 1,
                test: true,
              },
            },
            {
              requestDetails: {
                urlParams: { id: '5b589ccf3000000923fe500c' },
                requestPayload: {},
                endpointName: 'getRequest',
                requestId: action.requestDetails.requestId,
                cancelRequest: action.requestDetails.cancelRequest,
              },
              response: {
                id: 2,
                test: true,
              },
            },
          ],
        },
        requestsMetadata: {
          [action.requestDetails.requestId]: {
            isLoading: false,
            success: false,
          },
        },
      },
    });
  });
});
