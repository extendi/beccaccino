import {
  Beccaccino,
  beccaccinoMiddleware,
  beccaccinoReducer,
  resultSelector,
  errorSelector,
  BECCACCINO_REDUCER_NAME,
} from "../";

import { createStore, combineReducers, applyMiddleware } from "redux";

import { defaultSession } from "@lib/Beccaccino";

const store = createStore(
  combineReducers({
    [BECCACCINO_REDUCER_NAME]: beccaccinoReducer,
  }),
  {},
  applyMiddleware(beccaccinoMiddleware)
);

const client = Beccaccino.configure(
  {
    baseURL: "http://www.mocky.io/v2",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
  },
  [{ name: "getRequest", path: "/:id", method: "get" }]
);

const secondClient = Beccaccino.configure(
  {
    baseURL: "http://www.mocky.io/v2",
    headers: {
      "Content-type": "application/json",
      Accept: "application/json",
    },
  },
  [{ name: "getRequest", path: "/:id", method: "get" }],
  "secondClient"
);

describe("Integration tests with redux", () => {
  it("store default state in redux http reducer", () => {
    expect(store.getState()).toEqual({
      [BECCACCINO_REDUCER_NAME]: {
        results: {},
        requestsMetadata: {},
        requestsLog: {
          [defaultSession]: {},
        },
      },
    });
  });
});

describe("when http action is dispatched the middleware", () => {
  const action1 = client.getRequest({
    urlParams: { id: "5b589b113000002f27fe5005" },
  });
  const action2 = client.getRequest({
    urlParams: { id: "5b589ccf3000000923fe500c" },
  });

  const secondCLientaction1 = secondClient.getRequest({
    urlParams: { id: "5b589b113000002f27fe5005" },
  });
  const secondClientaction2 = secondClient.getRequest({
    urlParams: { id: "5b589ccf3000000923fe500c" },
  });

  it("store first request result", async () => {
    expect.assertions(3);
    store.dispatch(action1);
    await action1.execAsync;
    const state = store.getState();
    expect(state).toMatchObject({
      [BECCACCINO_REDUCER_NAME]: {
        results: {
          [action1.requestDetails.requestId]: {
            requestDetails: {
              urlParams: { id: "5b589b113000002f27fe5005" },
              requestPayload: {},
              endpointName: "getRequest",
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
        requestsLog: {
          [defaultSession]: {
            getRequest: {
              requests: [action1.requestDetails.requestId],
            },
          },
        },
      },
    });
    const resultSelectorResponse = resultSelector({
      state,
      endpointName: "getRequest",
      limit: -1,
    });
    const errorSelectorResponse = errorSelector({
      state,
      endpointName: "getRequest",
      limit: -1,
    });
    expect(resultSelectorResponse).toEqual([{ id: 1, test: true }]);
    expect(errorSelectorResponse).toEqual([
      { error: false, response: { id: 1, test: true } },
    ]);
  });

  it("store the second request result", async () => {
    expect.assertions(3);
    store.dispatch(action2);
    await action2.execAsync;
    const state = store.getState();
    expect(state).toMatchObject({
      [BECCACCINO_REDUCER_NAME]: {
        results: {
          [action1.requestDetails.requestId]: {
            requestDetails: {
              urlParams: { id: "5b589b113000002f27fe5005" },
              requestPayload: {},
              endpointName: "getRequest",
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
              urlParams: { id: "5b589ccf3000000923fe500c" },
              requestPayload: {},
              endpointName: "getRequest",
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
        requestsLog: {
          [defaultSession]: {
            getRequest: {
              requests: [
                action1.requestDetails.requestId,
                action2.requestDetails.requestId,
              ],
            },
          },
        },
      },
    });
    const resultSelectorResponse = resultSelector({
      state,
      endpointName: "getRequest",
    });
    expect(resultSelectorResponse).toEqual([{ id: 1, test: true }, undefined]);
    const errorSelectorResponse = errorSelector({
      state,
      endpointName: "getRequest",
    });
    expect(errorSelectorResponse).toEqual([
      { error: false, response: { id: 1, test: true } },
      { error: true, response: { id: 2, test: true } },
    ]);
  });

  it("store the first request result from second client", async () => {
    expect.assertions(3);
    store.dispatch(secondCLientaction1);
    await secondCLientaction1.execAsync;
    const state = store.getState();
    expect(state).toMatchObject({
      [BECCACCINO_REDUCER_NAME]: {
        results: {
          [action1.requestDetails.requestId]: {
            requestDetails: {
              urlParams: { id: "5b589b113000002f27fe5005" },
              requestPayload: {},
              endpointName: "getRequest",
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
              urlParams: { id: "5b589ccf3000000923fe500c" },
              requestPayload: {},
              endpointName: "getRequest",
              requestId: action2.requestDetails.requestId,
              cancelRequest: action2.requestDetails.cancelRequest,
            },
            response: {
              id: 2,
              test: true,
            },
          },
          [secondCLientaction1.requestDetails.requestId]: {
            requestDetails: {
              urlParams: { id: "5b589b113000002f27fe5005" },
              requestPayload: {},
              endpointName: "getRequest",
              requestId: secondCLientaction1.requestDetails.requestId,
              cancelRequest: secondCLientaction1.requestDetails.cancelRequest,
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
          [action2.requestDetails.requestId]: {
            isLoading: false,
            success: false,
          },
          [secondCLientaction1.requestDetails.requestId]: {
            isLoading: false,
            success: true,
          },
        },
        requestsLog: {
          [defaultSession]: {
            getRequest: {
              requests: [
                action1.requestDetails.requestId,
                action2.requestDetails.requestId,
                secondCLientaction1.requestDetails.requestId,
              ],
            },
          },
        },
      },
    });
    const resultSelectorResponse = resultSelector({
      state,
      endpointName: "getRequest",
    });
    expect(resultSelectorResponse).toEqual([
      { id: 1, test: true },
      undefined,
      { id: 1, test: true },
    ]);
    const errorSelectorResponse = errorSelector({
      state,
      endpointName: "getRequest",
    });
    expect(errorSelectorResponse).toEqual([
      { error: false, response: { id: 1, test: true } },
      { error: true, response: { id: 2, test: true } },
      { error: false, response: { id: 1, test: true } },
    ]);
  });

  it("store the second request result from second client", async () => {
    expect.assertions(3);
    store.dispatch(secondClientaction2);
    await secondClientaction2.execAsync;
    const state = store.getState();
    expect(state).toMatchObject({
      [BECCACCINO_REDUCER_NAME]: {
        results: {
          [action1.requestDetails.requestId]: {
            requestDetails: {
              urlParams: { id: "5b589b113000002f27fe5005" },
              requestPayload: {},
              endpointName: "getRequest",
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
              urlParams: { id: "5b589ccf3000000923fe500c" },
              requestPayload: {},
              endpointName: "getRequest",
              requestId: action2.requestDetails.requestId,
              cancelRequest: action2.requestDetails.cancelRequest,
            },
            response: {
              id: 2,
              test: true,
            },
          },
          [secondCLientaction1.requestDetails.requestId]: {
            requestDetails: {
              urlParams: { id: "5b589b113000002f27fe5005" },
              requestPayload: {},
              endpointName: "getRequest",
              requestId: secondCLientaction1.requestDetails.requestId,
              cancelRequest: secondCLientaction1.requestDetails.cancelRequest,
            },
            response: {
              id: 1,
              test: true,
            },
          },
          [secondClientaction2.requestDetails.requestId]: {
            requestDetails: {
              urlParams: { id: "5b589ccf3000000923fe500c" },
              requestPayload: {},
              endpointName: "getRequest",
              requestId: secondClientaction2.requestDetails.requestId,
              cancelRequest: secondClientaction2.requestDetails.cancelRequest,
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
          [secondCLientaction1.requestDetails.requestId]: {
            isLoading: false,
            success: true,
          },
          [secondClientaction2.requestDetails.requestId]: {
            isLoading: false,
            success: false,
          },
        },
        requestsLog: {
          [defaultSession]: {
            getRequest: {
              requests: [
                action1.requestDetails.requestId,
                action2.requestDetails.requestId,
                secondCLientaction1.requestDetails.requestId,
                secondClientaction2.requestDetails.requestId,
              ],
            },
          },
        },
      },
    });
    const resultSelectorResponse = resultSelector({
      state,
      endpointName: "getRequest",
    });
    expect(resultSelectorResponse).toEqual([
      { id: 1, test: true },
      undefined,
      { id: 1, test: true },
      undefined,
    ]);
    const errorSelectorResponse = errorSelector({
      state,
      endpointName: "getRequest",
    });
    expect(errorSelectorResponse).toEqual([
      { error: false, response: { id: 1, test: true } },
      { error: true, response: { id: 2, test: true } },
      { error: false, response: { id: 1, test: true } },
      { error: true, response: { id: 2, test: true } },
    ]);
  });
});
