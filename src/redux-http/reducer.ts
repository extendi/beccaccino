import {
  REDUX_HTTP_CLIENT_ERROR,
  REDUX_HTTP_CLIENT_RESPONSE,
  REDUX_HTTP_CLIENT_REQUEST,
  BindedActionResultPayload,
} from '@lib/redux-http';

const initialState = {
  results: {},
  requestsLog: {},
  requestsMetadata: {},
};

export const BECCACCINO_REDUCER_NAME = 'beccaccino_reducer';

export default function beccaccinoReducer(
  state: any = initialState,
  action: BindedActionResultPayload,
): any {
  switch (action.type) {
    case REDUX_HTTP_CLIENT_REQUEST:
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
          [action.requestDetails.endpointName]: [
            ...(state.requestsLog[action.requestDetails.endpointName] || []),
            action.requestDetails.requestId,
          ],
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
