import { v4 as uuid } from 'uuid';

type Sessions = {
  [sessionId: string]: {
    [endpoint: string]: {
      lastDispatchedRequestId: string,
      requestsLog: Array<string>,
    },
  },
};

type DispatchedRequestIdSetterInput = {
  endpointId: string,
  id: string,
  sessionId?: string,
};

type DispatchedRequestIdGetterInput = {
  endpointId: string,
  sessionId?: string,
};

const defaultSession: string = uuid();

export default class SessionManager {
  public metadata: Sessions = {
    [defaultSession]: {},
  };

  public getLastDispatchedRequestId(
    { endpointId, sessionId = defaultSession }: DispatchedRequestIdGetterInput,
  ): string {
    const session = this.metadata[sessionId];
    if (!session) throw Error(`Invalid session identifier ${sessionId}`);

    const endpoint = session[endpointId];
    if (!endpoint) return undefined;

    return endpoint.lastDispatchedRequestId;
  }

  public setLastDispatchedRequestId(
    {
      id,
      endpointId,
      sessionId = defaultSession,
    }: DispatchedRequestIdSetterInput) {
    const endpointMetadata: any =
      (this.metadata[sessionId] || {})[endpointId] || { requestsLog: [] };
    this.metadata = {
      ...this.metadata,
      [sessionId]: {
        ...this.metadata[sessionId] || {},
        [endpointId]: {
          ...endpointMetadata,
          lastDispatchedRequestId: id,
          requestsLog: [
            ...endpointMetadata.requestsLog,
            id,
          ],
        },
      },
    };
  }
}
