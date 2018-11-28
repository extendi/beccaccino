export * from './redux-http';
export * from './endpoint';
import { beccaccino } from './Beccaccino';

export const Beccaccino = {
  configure: beccaccino.configure,
  getClientInstance: beccaccino.getClientInstance,
  getClient: beccaccino.getClient,
};
