import {
  ReduxHttpClient,
  reduxHttpMiddleware,
  reduxHttpReducer,
  REDUX_HTTP_CLIENT_REDUCER_NAME,
} from "@lib/index";

import {
  createStore,
  combineReducers,
  applyMiddleware,
} from 'redux';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('Integration tests with redux', () => {
  const store = createStore(
    combineReducers({
      [REDUX_HTTP_CLIENT_REDUCER_NAME]: reduxHttpReducer,
    }),
    {},
    applyMiddleware(reduxHttpMiddleware),
  );

  const client = ReduxHttpClient.configure(
    {
      baseURL: 'https://api.punkapi.com/v2',
    },
    [
      { name: 'getBeers', path: '/beers/:id', method: 'get' },
    ]
  );

  it('store default state in redux http reducer', () => {
    expect(store.getState()).toEqual({
      [REDUX_HTTP_CLIENT_REDUCER_NAME]: {
        requests: {},
        requestsMetadata: {},
      },
    });
  });
});
