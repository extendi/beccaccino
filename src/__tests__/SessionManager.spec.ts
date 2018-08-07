import SessionManager from '@lib/SessionManager';
let sessionManager: SessionManager = null;

describe('SessionManager', () => {
  beforeEach(() => sessionManager = new SessionManager());

  describe('setLastDispatchedRequestId', () => {
    beforeEach(() => {
      sessionManager.setLastDispatchedRequestId({
        id: 'some-request-id',
        endpointId: 'getSomething',
        sessionId: 'some-session-id',
      });
      sessionManager.setLastDispatchedRequestId({
        id: 'some-other-request-id',
        endpointId: 'getSomething',
        sessionId: 'some-session-id',
      });
    });
    it('sets last dispatched request for endpoint and session', () => {
      const lastDispatchedRequestId = sessionManager
        .metadata['some-session-id']['getSomething'].lastDispatchedRequestId;

      expect(lastDispatchedRequestId).toEqual('some-other-request-id');
    });
    it('adds request to the requests log for endpoint and session', () => {
      const requestsLog = sessionManager
        .metadata['some-session-id']['getSomething'].requestsLog;

      expect(requestsLog).toEqual(['some-request-id', 'some-other-request-id']);
    });
  });
  describe('getLastDispatchedRequestId', () => {
    beforeEach(() => {
      sessionManager.setLastDispatchedRequestId({
        id: 'some-request-id',
        endpointId: 'getSomething',
        sessionId: 'some-session-id',
      });
      sessionManager.setLastDispatchedRequestId({
        id: 'some-other-request-id',
        endpointId: 'getSomething',
        sessionId: 'some-session-id',
      });
    });
    it('gets last dispatched request for endpoint and session', () => {
      const lastDispatchedRequestId = sessionManager
        .getLastDispatchedRequestId({
          endpointId: 'getSomething',
          sessionId: 'some-session-id',
        });

      expect(lastDispatchedRequestId).toEqual('some-other-request-id');
    });
  });
  describe('getRequestsLog', () => {
    beforeEach(() => {
      sessionManager.setLastDispatchedRequestId({
        id: 'some-request-id',
        endpointId: 'getSomething',
        sessionId: 'some-session-id',
      });
      sessionManager.setLastDispatchedRequestId({
        id: 'some-other-request-id',
        endpointId: 'getSomething',
        sessionId: 'some-session-id',
      });
    });
    it('should return the requests log', () => {
      const log = sessionManager.getRequestsLog({
        endpointId: 'getSomething',
        sessionId: 'some-session-id',
      });
      expect(log).toEqual([
        'some-request-id',
        'some-other-request-id',
      ]);
    });
  });
});
