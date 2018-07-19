import { BindRequest, BindedAction } from 'endpoint';
import requestHandler from 'endpoint/requestHandler';

const bindParamsToURL = (url : string, params: any) => url; // TODO DO THE REAL STUFF

export default class Endpoint {
  static bindAction(bindRequest: BindRequest): BindedAction {
    return ({ urlParams = {}, requestPayload = {} } : { urlParams: any, requestPayload: any}) => ({
      type: bindRequest.actioName,
      signature: bindRequest.signature,
      requestDetails: {
        urlParams,
        requestPayload,
      },
      execAsync: requestHandler({
        requestConfiguration: {
          method: bindRequest.config.method,
          url: bindParamsToURL(bindRequest.config.path, urlParams),
          data: requestPayload,
        },
        errorTransformer: bindRequest.config.errorTransformer,
        responseTransformer: bindRequest.config.responseTransformer,
        axiosInstance: bindRequest.axiosInstance,
      }),
    });
  }
}
