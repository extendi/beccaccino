import {
  BindedActionPayload,
  REDUX_HTTP_ACTION_SIGNATURE,
  REDUX_HTTP_CLIENT_REQUEST,
  REDUX_HTTP_CLIENT_ERROR,
  REDUX_HTTP_CLIENT_RESPONSE,
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
    next({
      type: REDUX_HTTP_CLIENT_RESPONSE,
      requestDetails: action.requestDetails,
      response: result,
    });
    Promise.resolve(result);
  })
  .catch((errors) => {
    next({
      type: REDUX_HTTP_CLIENT_ERROR,
      requestDetails: action.requestDetails,
      response: errors,
    });
    Promise.resolve(errors);
  });
};

export default httpClientMiddleware;
