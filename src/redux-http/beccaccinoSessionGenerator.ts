export interface SessionManager {
  get: () => string;
  refresh: () => void;
}

const generateSessionManager = () =>
  (function sessionStore() {
    let currentSession = new Date().toISOString();
    return {
      get: () => currentSession,
      refresh: () => {
        currentSession = new Date().toISOString();
      },
    };
  })();

export default generateSessionManager;
