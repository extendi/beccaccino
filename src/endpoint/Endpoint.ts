import { BindRequest, BindedAction } from '@lib/endpoint';
import requestHandler from '@lib/endpoint/requestHandler';
import { compile as compilePath } from 'path-to-regexp';
import { v4 as uuid } from 'uuid';

const bindParamsToURL = (url : string, params: any) => compilePath(url)(params);

export default class Endpoint {
  static bindAction(bindRequest: BindRequest): BindedAction {
    return ({ urlParams = {}, requestPayload = {} } : { urlParams: any, requestPayload: any}) => ({
      type: bindRequest.actionName,
      signature: bindRequest.signature,
      requestDetails: {
        urlParams,
        requestPayload,
        endpointName: bindRequest.config.name,
        requestId: uuid(),
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
