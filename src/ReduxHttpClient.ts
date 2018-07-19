import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { EndpointConfig, Endpoint, BindedAction } from 'endpoint';

export type EndpointMap = {
  [key : string]: BindedAction,
}

class ReduxHttpClient {
  private readonly axiosInstance : AxiosInstance;
  private readonly axiosConfiguration : AxiosRequestConfig;
  private readonly endpoints : Array<EndpointConfig>;
  public readonly bindedEndpoints : EndpointMap = {};

  constructor(axiosConfiguration: AxiosRequestConfig, endpoints : Array<EndpointConfig>) {
    this.axiosConfiguration = axiosConfiguration;
    this.axiosInstance = axios.create(this.axiosConfiguration);
    this.endpoints = endpoints;
    this.bindEndpoints();
  }

  private bindEndpoints() : void {
    this.endpoints.forEach((endpoint) => {
      this.bindedEndpoints[endpoint.name] = Endpoint.bindAction({
        config: endpoint,
        actioName: 'lol',
        axiosInstance: this.axiosInstance,
      });
    });
  }
}

const reduxHttpClientInitializer = (() => {
  let clientInstance : ReduxHttpClient = null;
  return  {
    configure: (configuration : AxiosRequestConfig , endpoints : Array<EndpointConfig>) :EndpointMap => {
      if (clientInstance) throw Error('Redux http client instance already configured');
      clientInstance = new ReduxHttpClient(configuration, endpoints);
      return clientInstance.bindedEndpoints;
    },
    getClient: () :EndpointMap => {
      if (!clientInstance) throw Error('Redux http client instance not configured');
      return clientInstance.bindedEndpoints;
    },
  };
})();

export default reduxHttpClientInitializer;
