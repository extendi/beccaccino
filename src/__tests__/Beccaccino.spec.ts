import { Beccaccino } from '../';

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
      .toThrowError('Redux http client defaultClient already configured');
  });
  it('Does configure the endpoints functions', () => {
    const endpoints = Beccaccino.getClient();
    expect(typeof endpoints.getPippo).toEqual('function');
    expect(typeof endpoints.getPluto).toEqual('function');
  });
  it('Configure and returns a named client', () => {
    const namedClientInstance = Beccaccino.configure({}, [
      { name: 'testPippo', path: 'https://google.test', method: 'get' },
      { name: 'testPluto', path: 'https://google.lol', method: 'post' },
    ], 'testClient');
    expect(Beccaccino.getClient('testClient')).toBe(namedClientInstance);
  });
  it('Configure endpoints functions for a named client', () => {
    const endpoints = Beccaccino.getClient('testClient');
    expect(typeof endpoints.testPippo).toEqual('function');
    expect(typeof endpoints.testPluto).toEqual('function');
  });
  it('Does not allow a reconfiguration of a named client', () => {
    expect(() => Beccaccino.configure({}, [], 'testClient'))
    .toThrowError('Redux http client testClient already configured');
  });
});
