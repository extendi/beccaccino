import Beccaccino from '@lib/Beccaccino';

const clientInstance = Beccaccino.configure({}, [
  { name: 'getPippo', path: 'https://google.com', method: 'get' },
  { name: 'getPluto', path: 'https://google.nz', method: 'get' },
]);

describe('Beccaccino', () => {
  it('Returns a single instance of Beccaccino class', () => {
    expect(Beccaccino.getClient()).toBe(clientInstance);
  });
  it('Does not allow reconfiguration of library', () => {
    expect(() => Beccaccino.configure({}, []))
      .toThrowError('Redux http client instance already configured');
  });
  it('Does configure the endpoints functions', () => {
    const endpoints = Beccaccino.getClient();
    expect(typeof endpoints.getPippo).toEqual('function');
    expect(typeof endpoints.getPluto).toEqual('function');
  });

  describe('lastDispatchedRequestId', () => {
    it('set lastDispatchedRequestId', () => {
      Beccaccino.setLastDispatchedRequestId({
        endpoint: 'getSomething',
        id: 'some-request-id',
      });
      const id = Beccaccino.getClientInstance()
        .sessionManager.getLastDispatchedRequestId({
          endpointId: 'getSomething',
        });

      expect(id).toEqual('some-request-id');
    });
    it('get lastDispatchedRequestId', () => {
      Beccaccino.getClientInstance()
        .sessionManager.setLastDispatchedRequestId({
          endpointId: 'getSomethingElse',
          id: 'some-other-id',
        });
      const lastReqId = Beccaccino.getLastDispatchedRequestId({
        endpoint: 'getSomethingElse',
      });

      expect(lastReqId).toEqual('some-other-id');
    });
  });
  describe('getRequestsLog', () => {
    it('get requests log', () => {
      Beccaccino.getClientInstance()
        .sessionManager.setLastDispatchedRequestId({
          endpointId: 'logEndpoint',
          id: 'some-other-id',
          sessionId: 'test-session',
        });
      const log = Beccaccino.getRequestsLog({
        endpoint: 'logEndpoint',
        sessionId: 'test-session',
      });
      expect(log).toEqual(['some-other-id']);
    });
  });
});
