export interface SessionManager {
  get: () => string;
  refresh: () => void;
}

export const beccaccinoSession = () =>
  (function sessionStore() {
    let currentSession = new Date().toISOString();
    return {
      get: () => currentSession,
      refresh: () => {
        currentSession = new Date().toISOString();
      },
    };
  })();
