import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { EndpointConfig, Endpoint, BindedAction } from './endpoint';
import { REDUX_HTTP_ACTION_SIGNATURE, REDUX_HTTP_CLIENT_REQUEST } from './redux-http';
import { v4 as uuid } from 'uuid';

export type EndpointMap = {
  [key: string]: BindedAction,
};

export const defaultSession: string = uuid();

const BECCACCINO_DEFAULT_CLIENT_NAME = 'defaultClient';

export class ReduxHttpClient {
  public readonly axiosInstance: AxiosInstance;
  private readonly axiosConfiguration: AxiosRequestConfig;
  private readonly endpoints: Array<EndpointConfig>;
  public readonly bindedEndpoints: EndpointMap = {};
  private readonly clientName: string;

  constructor(
    axiosConfiguration: AxiosRequestConfig,
    endpoints: Array<EndpointConfig>,
    clientName: string,
    ) {
    this.axiosConfiguration = axiosConfiguration;
    this.axiosInstance = axios.create(this.axiosConfiguration);
    this.endpoints = endpoints;
    this.clientName = clientName;
    this.bindEndpoints();
  }

  private bindEndpoints(): void {
    this.endpoints.forEach((endpoint) => {
      this.bindedEndpoints[endpoint.name] = Endpoint.bindAction({
        clientName: this.clientName,
        config: endpoint,
        actionName: REDUX_HTTP_CLIENT_REQUEST,
        axiosInstance: this.axiosInstance,
        signature: REDUX_HTTP_ACTION_SIGNATURE,
      });
    });
  }
}

export const beccaccino = (() => {
  let configuredClients: { [name: string] : ReduxHttpClient } = {};
  return {
    configure: (
      configuration: AxiosRequestConfig,
      endpoints: Array<EndpointConfig>,
      clientName: string = BECCACCINO_DEFAULT_CLIENT_NAME,
    ): EndpointMap => {
      if (configuredClients[clientName]) throw Error(`Redux http client ${clientName} already configured`);
      configuredClients[clientName] = new ReduxHttpClient(configuration, endpoints, clientName);
      return configuredClients[clientName].bindedEndpoints;
    },
    getClient: (clientName: string = BECCACCINO_DEFAULT_CLIENT_NAME): EndpointMap => {
      const clientInstance = configuredClients[clientName];
      if (!clientInstance) throw Error('Redux http client instance not configured');
      return clientInstance.bindedEndpoints;
    },
    getClientInstance: (clientName: string = BECCACCINO_DEFAULT_CLIENT_NAME) => {
      const clientInstance = configuredClients[clientName];
      if (!clientInstance) throw Error('Redux http client instance not configured');
      return clientInstance;
    },
  };
})();
