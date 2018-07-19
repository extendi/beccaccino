import { AxiosResponse, AxiosRequestConfig, AxiosInstance } from 'axios';
import { ErrorTransform, ResponseTransform } from 'Endpoint';

const defaulTransformFunction = (x : any) : any => x;
const defaultErrorTransformFunction = (x : any) : any => x;

type RequestHandlerParams = {
  requestConfiguration: AxiosRequestConfig,
  errorTransformer: ErrorTransform,
  responseTransformer: ResponseTransform,
  axiosInstance : AxiosInstance,
};
export default function requestHandler({
  requestConfiguration,
  errorTransformer = defaultErrorTransformFunction,
  axiosInstance,
  responseTransformer = defaulTransformFunction,
}: RequestHandlerParams) : Promise<AxiosResponse> {
  return axiosInstance.request(requestConfiguration)
  .then(response => responseTransformer(response))
  .catch(error => errorTransformer(error));
}
