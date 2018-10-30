export * from './redux-http';
export * from './endpoint';
import { default as InternalBeccaccino } from './Beccaccino';

export const Beccaccino = {
  configure: InternalBeccaccino.configure,
  getClient: InternalBeccaccino.getClient,
};
