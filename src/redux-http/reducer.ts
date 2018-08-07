import {
  REDUX_HTTP_CLIENT_ERROR,
  REDUX_HTTP_CLIENT_RESPONSE,
  REDUX_HTTP_CLIENT_REQUEST,
  BindedActionResultPayload,
} from '@lib/redux-http';
import { defaultSession } from '@lib/Beccaccino';

const initialState = {
  results: {},
  requestsMetadata: {},
  requestsLog: { [defaultSession]: {} },
};

export const BECCACCINO_REDUCER_NAME = 'beccaccino_reducer';

export default function beccaccinoReducer(
  state: any = initialState,
  action: BindedActionResultPayload,
): any {
  switch (action.type) {
    case REDUX_HTTP_CLIENT_REQUEST:
      const sessionId = action.requestDetails.sessionId || defaultSession;
      const endpointMetadata =
        (state.requestsLog[sessionId] || {})[action.requestDetails.endpointName]
        || { requests: [] };

      return {
        ...state,
        requestsMetadata: {
          ...state.requestsMetadata,
          [action.requestDetails.requestId]: {
            isLoading: true,
            success: undefined,
          },
        },
        requestsLog: {
          ...state.requestsLog,
          [sessionId]: {
            ...state.requestsLog[sessionId] || {},
            [action.requestDetails.endpointName]: {
              ...endpointMetadata,
              requests: [
                ...endpointMetadata.requests,
                action.requestDetails.requestId,
              ],
            },
          },
        },
      };
    case REDUX_HTTP_CLIENT_RESPONSE:
    case REDUX_HTTP_CLIENT_ERROR:
      return {
        ...state,
        results: {
          ...state.results,
          [action.requestDetails.requestId]: {
            ...(state.results[action.requestDetails.requestId] || {}),
            requestDetails: action.requestDetails,
            rawResponse: action.response.rawResponse,
            response: action.response.data,
          },
        },
        requestsMetadata: {
          ...state.requestsMetadata,
          [action.requestDetails.requestId]: {
            isLoading: false,
            success: action.response.success,
          },
        },
      };
    default:
      return state;
  }
}
