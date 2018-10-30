import { AxiosResponse, AxiosInstance, AxiosRequestConfig } from 'axios';
import { ErrorTransform, ResponseTransform } from './requestHandler';

export type requestHandler = (
  requestConfiguration: AxiosRequestConfig,
  errorTransformer: ErrorTransform,
  responseTransformer: ResponseTransform,
  axiosInstance: AxiosInstance,
) => Promise<AxiosResponse>;

export * from './Endpoint';
export * from './requestHandler';
