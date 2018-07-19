import { BindRequest, BindedAction } from 'endpoint';
import requestHandler from 'endpoint/requestHandler';

export const ACTION_SIGNATURE = Symbol('REDUX:HTTP_CLIENT_ACTION');

const bindParamsToURL = (url : string, params: any) => url; // TODO DO THE REAL STUFF

export default class Endpoint {
  static bindAction(bindRequest: BindRequest): BindedAction {
    return (params : any) => ({
      type: bindRequest.actioName,
      signature: ACTION_SIGNATURE,
      execAsync: requestHandler({
        requestConfiguration: {
          method: bindRequest.config.method,
          url: bindParamsToURL(bindRequest.config.path, params),
        },
        errorTransformer: bindRequest.config.errorTransformer,
        responseTransformer: bindRequest.config.responseTransformer,
        axiosInstance: bindRequest.axiosInstance,
      }),
    });
  }
}
