import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { EndpointConfig, Endpoint, BindedAction } from './endpoint';
import { REDUX_HTTP_ACTION_SIGNATURE, REDUX_HTTP_CLIENT_REQUEST } from './redux-http';
import { v4 as uuid } from 'uuid';

export type EndpointMap = {
  [key: string]: BindedAction,
};

export const defaultSession: string = uuid();

class ReduxHttpClient {
  private readonly axiosInstance: AxiosInstance;
  private readonly axiosConfiguration: AxiosRequestConfig;
  private readonly endpoints: Array<EndpointConfig>;
  public readonly bindedEndpoints: EndpointMap = {};

  constructor(axiosConfiguration: AxiosRequestConfig, endpoints: Array<EndpointConfig>) {
    this.axiosConfiguration = axiosConfiguration;
    this.axiosInstance = axios.create(this.axiosConfiguration);
    this.endpoints = endpoints;
    this.bindEndpoints();
  }

  private bindEndpoints(): void {
    this.endpoints.forEach((endpoint) => {
      this.bindedEndpoints[endpoint.name] = Endpoint.bindAction({
        config: endpoint,
        actionName: REDUX_HTTP_CLIENT_REQUEST,
        axiosInstance: this.axiosInstance,
        signature: REDUX_HTTP_ACTION_SIGNATURE,
      });
    });
  }
}

export const beccaccino = (() => {
  let clientInstance: ReduxHttpClient = null;
  return {
    configure: (
      configuration: AxiosRequestConfig,
      endpoints: Array<EndpointConfig>,
    ): EndpointMap => {
      if (clientInstance) throw Error('Redux http client instance already configured');
      clientInstance = new ReduxHttpClient(configuration, endpoints);
      return clientInstance.bindedEndpoints;
    },
    getClient: (): EndpointMap => {
      if (!clientInstance) throw Error('Redux http client instance not configured');
      return clientInstance.bindedEndpoints;
    },
    getClientInstance: () => {
      if (!clientInstance) throw Error('Redux http client instance not configured');
      return clientInstance;
    },
  };
})();
