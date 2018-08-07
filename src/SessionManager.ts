import { v4 as uuid } from 'uuid';

type Sessions = {
  [sessionId: string]: {
    [endpoint: string]: {
      lastDispatchedRequestId: string,
      requestsLog: Array<string>,
    },
  },
};

type RequestIdDescriptor = SessionEndpointDescriptor  & {
  id: string,
};

type SessionEndpointDescriptor = {
  endpointId: string,
  sessionId?: string,
};

const defaultSession: string = uuid();

export default class SessionManager {
  public metadata: Sessions = {
    [defaultSession]: {},
  };

  public getLastDispatchedRequestId(
    { endpointId, sessionId = defaultSession }: SessionEndpointDescriptor,
  ): string {
    const session = this.metadata[sessionId];
    if (!session) throw Error(`Invalid session identifier ${sessionId}`);

    const endpoint = session[endpointId];
    if (!endpoint) return undefined;

    return endpoint.lastDispatchedRequestId;
  }

  public getRequestsLog(
    { endpointId, sessionId = defaultSession } : SessionEndpointDescriptor,
  ) : Array<string> {
    const session = this.metadata[sessionId];
    if (!session) throw Error(`Invalid session identifier ${sessionId}`);
    const endpoint = session[endpointId];
    if (!endpoint) return undefined;

    return endpoint.requestsLog;
  }

  public setLastDispatchedRequestId(
    {
      id,
      endpointId,
      sessionId = defaultSession,
    }: RequestIdDescriptor) {
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
