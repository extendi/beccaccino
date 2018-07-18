import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import invariant from 'invariant';

export default class ReduxHttpClient {
  public static clientInstance : ReduxHttpClient;

  private readonly axiosInstance : AxiosInstance;
  private readonly axiosConfiguration : AxiosRequestConfig;
  private readonly endpoints : any; // We should implement the type

  private constructor(axiosConfiguration: AxiosRequestConfig, endpoints : any) {
    this.axiosConfiguration = axiosConfiguration;
    this.axiosInstance = axios.create(this.axiosConfiguration);
    this.endpoints = endpoints;
  }

  static setupHttpClient(
    axiosConfiguration : AxiosRequestConfig,
    endpoints : any,
  ) { // TODO: When axios works add here the endpoints? @sciamp
    if (!this.clientInstance) {
      this.clientInstance = new ReduxHttpClient(axiosConfiguration, endpoints);
    }
    return this.clientInstance;
  }

  static getClient() {
    invariant(!this.clientInstance, 'redux-http-client not configured yet!');
    return this.clientInstance;
  }

  getEndpoints() {
    return this.endpoints; // Later the binded endpoints
  }

  getAxiosIntance() {
    return this.axiosInstance;
  }
}
