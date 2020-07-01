export interface SessionManager {
  get: () => string;
  refresh: () => void;
}

export const beccaccinoSessionGenerator = () =>
  (function sessionStore() {
    let currentSession = new Date().toISOString();
    return {
      get: () => currentSession,
      refresh: () => {
        currentSession = new Date().toISOString();
      },
    };
  })();
