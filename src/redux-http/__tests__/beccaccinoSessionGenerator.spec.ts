import { beccaccinoSessionGenerator } from "../beccaccinoSessionGenerator";

let currentSession = new Date().toISOString();

const mockSessionManager = {
  get: () => currentSession,
  refresh: () => {
    currentSession = new Date().toISOString();
  },
};

const sleep = (timeout: number) =>
  new Promise((res) => setTimeout(res, timeout));

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
  it("tests sessionManager refresh function value", () => {
    expect(sessionManager.refresh()).toBeUndefined;
  });
  it("tests sessionManager refresh function with mock", async () => {
    const oldSessionManagerTime = new Date(
      sessionManager.get()
    ).getMilliseconds();
    await sleep(2000);
    sessionManager.refresh();
    const newSessionManagerTime = new Date(
      sessionManager.get()
    ).getMilliseconds();
    expect(oldSessionManagerTime).toBeLessThan(newSessionManagerTime);
  });
});
