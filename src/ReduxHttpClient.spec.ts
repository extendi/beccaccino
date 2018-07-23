import ReduxHttpClient from '@lib/ReduxHttpClient';

const clientInstance = ReduxHttpClient.configure({}, [
  { name: 'getPippo', path: 'https://google.com', method: 'get' },
  { name: 'getPluto', path: 'https://google.nz', method: 'get' },
]);

describe('ReduxHttpClient', () => {
  it('Returns a single instance of ReduxHttpClient class', () => {
    expect(ReduxHttpClient.getClient()).toBe(clientInstance);
  });
  it('Does not allow reconfiguration of library', () => {
    expect(() => ReduxHttpClient.configure({}, []))
      .toThrowError('Redux http client instance already configured');
  });
  it('Does configure the endpoints functions', () => {
    const endpoints = ReduxHttpClient.getClient();
    expect(typeof endpoints.getPippo).toEqual('function');
    expect(typeof endpoints.getPluto).toEqual('function');
  });
});
