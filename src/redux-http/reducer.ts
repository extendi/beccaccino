import {
  REDUX_HTTP_CLIENT_ERROR,
  REDUX_HTTP_CLIENT_RESPONSE,
  REDUX_HTTP_CLIENT_REQUEST,
  BindedActionResultPayload,
} from '@lib/redux-http';

const initialState = {
  requests: {},
  requestsMetadata: {},
};

export default function reduxHttpReducer(
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
      };
    case REDUX_HTTP_CLIENT_RESPONSE:
    case REDUX_HTTP_CLIENT_ERROR:
      return {
        ...state,
        requests: {
          ...state.requests,
          [action.requestDetails.endpointName]: [
            ...(state.requests[action.requestDetails.endpointName] || []),
            {
              requestDetails: action.requestDetails,
              rawResponse: action.response.rawResponse,
              response: action.response.data,
            },
          ],
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
