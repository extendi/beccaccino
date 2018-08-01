import { BindRequest, BindedAction } from '@lib/endpoint';
import requestHandler from '@lib/endpoint/requestHandler';
import { compile as compilePath } from 'path-to-regexp';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

const bindParamsToURL = (url: string, params: any) => compilePath(url)(params);

export default class Endpoint {
  static bindAction(bindRequest: BindRequest): BindedAction {
    return ({ urlParams = {}, requestPayload = {} }: { urlParams: any, requestPayload: any }) => {
      const cancelToken = axios.CancelToken.source();
      const method = bindRequest.config.method.toLowerCase();
      return {
        type: bindRequest.actionName,
        signature: bindRequest.signature,
        requestDetails: {
          urlParams,
          requestPayload,
          endpointName: bindRequest.config.name,
          requestId: uuid(),
          cancelRequest: cancelToken.cancel,
        },
        execAsync: requestHandler({
          requestConfiguration: {
            method,
            url: bindParamsToURL(bindRequest.config.path, urlParams),
            data: method !== 'get' && requestPayload,
            params: method === 'get' && requestPayload,
            cancelToken: cancelToken.token,
          },
          errorTransformer: bindRequest.config.errorTransformer,
          responseTransformer: bindRequest.config.responseTransformer,
          axiosInstance: bindRequest.axiosInstance,
        }),
      };
    };
  }
}
