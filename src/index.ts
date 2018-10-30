export * from './redux-http';
import { default as InternalBeccaccino } from './Beccaccino';

export const Beccaccino = {
  configure: InternalBeccaccino.configure,
  getClient: InternalBeccaccino.getClient,
};
