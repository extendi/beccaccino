import ReduxHttpClient from 'ReduxHttpClient';
import { AxiosResponse, AxiosRequestConfig, AxiosInstance } from '../node_modules/axios';

// I used the default parameter for 'dependency injection' and testing do you agree?
// When we implement the endpoints, every enpoint can have
// his transform function and we can access them
// using a method in the class and injecting it in this function in the then of request
// you agree? @sciamp

// For dev purpose

const defaulTransformFunction = (x : any) : any => x;
const defaultErrorTransformFunction = (x : any) : any => x;

export default function requestHandler(
  requestConfiguration: AxiosRequestConfig,
  axiosInstance : AxiosInstance = ReduxHttpClient.getClient().getAxiosIntance(),
) : Promise<AxiosResponse> {
  return axiosInstance.request(requestConfiguration)
  .then(response => defaulTransformFunction(response))
  .catch(error => defaultErrorTransformFunction(error));
}
