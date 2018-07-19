import { reduxHttpMiddleware }from '@lib/redux-http';

const nextSpyMock = jest.fn();

afterEach(() => {
  jest.clearAllMocks();
});

describe('http Client Middleware', () => {
  it('Should not handle extraneous actions', () => {
    const extraneousAction = {
      type: 'EXTRANEOUS',
      payload: 'not interesting',
    };

    const result = reduxHttpMiddleware(null)(nextSpyMock)(extraneousAction);
    expect(result).toBeUndefined();
    expect(nextSpyMock).toHaveReturnedTimes(1);
    expect(nextSpyMock).toHaveBeenCalledWith(extraneousAction);
  });
});
