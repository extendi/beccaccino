export * from '@lib/redux-http';
import { default as InternalBeccaccino } from '@lib/Beccaccino';

export const Beccaccino = {
  configure: InternalBeccaccino.configure,
  getClient: InternalBeccaccino.getClient,
  setLastDispatchedRequestId: InternalBeccaccino.setLastDispatchedRequestId,
};
