import ReduxHttpClient from 'ReduxHttpClient';
import { AxiosResponse, AxiosRequestConfig, AxiosInstance } from 'axios';
import { ErrorTransform, ResponseTransform } from 'Endpoint';

const defaulTransformFunction = (x : any) : any => x;
const defaultErrorTransformFunction = (x : any) : any => x;

export default function requestHandler(
  requestConfiguration: AxiosRequestConfig,
  errorTransformer: ErrorTransform = defaultErrorTransformFunction,
  responseTransformer: ResponseTransform = defaulTransformFunction,
  axiosInstance : AxiosInstance = ReduxHttpClient.getClient().getAxiosIntance(),
) : Promise<AxiosResponse> {
  return axiosInstance.request(requestConfiguration)
  .then(response => responseTransformer(response))
  .catch(error => errorTransformer(error));
}
