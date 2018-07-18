import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import invariant from 'invariant';

export default class ReduxHttpClient {
  public static clientInstance : ReduxHttpClient;

  private readonly axiosInstance : AxiosInstance;
  private readonly axiosConfiguration : AxiosRequestConfig;

  private constructor(axiosConfiguration: AxiosRequestConfig) {
    this.axiosConfiguration = axiosConfiguration;
    this.axiosInstance = axios.create(this.axiosConfiguration);
  }

  static setupHttpClient(
    axiosConfiguration : AxiosRequestConfig,
  ) { // TODO: When axios works add here the endpoints? @sciamp
    if (!this.clientInstance) this.clientInstance = new ReduxHttpClient(axiosConfiguration);
    return this.clientInstance;
  }

  static getClient() {
    invariant(!this.clientInstance, 'redux-http-client not configured yet!');
    return this.clientInstance;
  }

  getAxiosIntance() {
    return this.axiosInstance;
  }
}
