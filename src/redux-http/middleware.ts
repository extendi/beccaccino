import {
  BindedActionPayload,
  REDUX_HTTP_ACTION_SIGNATURE,
  REDUX_HTTP_CLIENT_REQUEST,
  REDUX_HTTP_CLIENT_ERROR,
  REDUX_HTTP_CLIENT_RESPONSE,
  BindedActionResultPayload,
} from 'redux-http';
import { Middleware } from 'redux';

const shouldHandleAction = (action: BindedActionPayload) : Boolean => {
  return action.signature === REDUX_HTTP_ACTION_SIGNATURE &&
  action.type === REDUX_HTTP_CLIENT_REQUEST &&
  action.execAsync instanceof Promise;
};

const httpClientMiddleware : Middleware = _ => next => (action : BindedActionPayload) => {
  if (!shouldHandleAction(action)) {
    next(action);
    return;
  }
  next({
    type: REDUX_HTTP_CLIENT_REQUEST,
    requestDetails: action.requestDetails,
  });
  return action.execAsync
  .then((result) => {
    const successPayloadToDispatch : BindedActionResultPayload = {
      type: REDUX_HTTP_CLIENT_RESPONSE,
      requestDetails: action.requestDetails,
      response: result,
    };
    next(successPayloadToDispatch);
    Promise.resolve(result);
  })
  .catch((errors) => {
    const errorPayloadToDispatch : BindedActionResultPayload = {
      type: REDUX_HTTP_CLIENT_ERROR,
      requestDetails: action.requestDetails,
      response: errors,
    };
    next(errorPayloadToDispatch);
    Promise.resolve(errors);
  });
};

export default httpClientMiddleware;
