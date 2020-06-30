import beccaccinoSessionGenerator from "../beccaccinoSessionGenerator";

let currentSession = new Date().toISOString();

const mockSessionManager = {
  get: () => currentSession,
  refresh: () => {
    currentSession = new Date().toISOString();
  },
};

describe("beccaccinoSessionGenerator", () => {
  const sessionManager = beccaccinoSessionGenerator();
  it("tests type of sessionManager", () => {
    expect(typeof sessionManager).toEqual("object");
  });
  it("tests type of sessionManager attributes", () => {
    expect(typeof sessionManager.get).toEqual("function");
    expect(typeof sessionManager.refresh).toEqual("function");
  });
  it("tests sessionManager structure with stringify", () => {
    expect(JSON.stringify(sessionManager)).toBe(
      JSON.stringify(mockSessionManager)
    );
  });
  it("tests sessionManager get function", () => {
    expect(
      new Date(sessionManager.get()).getMilliseconds()
    ).toBeGreaterThanOrEqual(
      new Date(mockSessionManager.get()).getMilliseconds()
    );
  });
  it("tests sessionManager refresh function", () => {
    expect(sessionManager.refresh()).toBe(undefined);
  });
});
