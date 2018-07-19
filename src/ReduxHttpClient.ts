import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Endpoints } from 'Endpoint';
import requestHandler from 'requestHandler';

class ReduxHttpClient {
  private readonly axiosInstance : AxiosInstance;
  private readonly axiosConfiguration : AxiosRequestConfig;
  private readonly endpoints : Endpoints; // We should implement the type

  constructor(axiosConfiguration: AxiosRequestConfig, endpoints : Endpoints) {
    this.axiosConfiguration = axiosConfiguration;
    this.axiosInstance = axios.create(this.axiosConfiguration);
    this.endpoints = endpoints;
    this.bindEndpoints();
  }

  private bindEndpoints() : void {
    this.endpoints.forEach((endpoint) => {
      const { name, path } = endpoint;
      this[name] = async () => {
        console.log(`I am the method with ${name} and ${path}`);
        const response = await requestHandler({ url: path, method: 'get' });
        console.log('The response is ', response);
      };
    });
  }
  getEndpoints() {
    return this.endpoints;
  }
  getAxiosIntance() {
    return this.axiosInstance;
  }
}

const reduxHttpClientInitializer = (() => {
  let clientInstance : ReduxHttpClient = null;
  return  {
    configure: (configuration : AxiosRequestConfig , endpoints : Endpoints) :ReduxHttpClient => {
      if (clientInstance) throw Error('Redux http client instance already configured');
      clientInstance = new ReduxHttpClient(configuration, endpoints);
      return clientInstance;
    },
    getClient: () :ReduxHttpClient => {
      if (!clientInstance) throw Error('Redux http client instance not configured');
      return clientInstance;
    },
  };
})();

export default reduxHttpClientInitializer;
