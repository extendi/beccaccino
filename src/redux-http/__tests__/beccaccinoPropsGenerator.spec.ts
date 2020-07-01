import beccaccinoPropsGenerator, {
  returnBeccaccinoResults,
} from "../beccaccinoPropsGenerator";
import { BECCACCINO_REDUCER_NAME } from "../";
import { defaultSession } from "../../Beccaccino";

type BeccaccinoResults = {
  resultFunctions: any[];
  loadingFunctions: any[];
  errorFunctions: any[];
};

const baseState = {
  [BECCACCINO_REDUCER_NAME]: {
    results: {
      request1: {
        requestDetails: {
          requestId: "request1",
        },
        rawResponse: {},
        response: { data: ["test"] },
      },
    },
    requestsLog: {
      [defaultSession]: {
        testEndpoint: {
          requests: ["request1"],
        },
      },
    },
  },
};

describe("beccaccinoPropsGenerator", () => {
  const beccaccinoSelectors = beccaccinoPropsGenerator({ endpoints: [] });
  it("tests type of beccaccinoSelectors", () => {
    expect(typeof beccaccinoSelectors).toEqual("function");
  });
  it("test auxiliary function returnBeccaccinoResults with no endpoints", () => {
    const emptyResults: BeccaccinoResults = {
      resultFunctions: [],
      loadingFunctions: [],
      errorFunctions: [],
    };
    expect(returnBeccaccinoResults({ endpoints: [] })).toEqual(emptyResults);
  });
  it("test auxiliary function returnBeccaccinoResults resultFunctions with endpoints has length", () => {
    expect(
      returnBeccaccinoResults({
        endpoints: [
          {
            name: "testFunction",
            resultPropAlias: "testFunctionDone",
            errorPropAlias: "testFunctionError",
          },
          {
            name: "testTwoFunction",
            resultPropAlias: "testTwoFunctionDone",
            errorPropAlias: "testTwoFunctionError",
          },
        ],
      }).resultFunctions
    ).toHaveLength(2);
  });
  it("test auxiliary function returnBeccaccinoResults errorFunctions with endpoints has length", () => {
    expect(
      returnBeccaccinoResults({
        endpoints: [
          {
            name: "testFunction",
            resultPropAlias: "testFunctionDone",
            errorPropAlias: "testFunctionError",
          },
          {
            name: "testTwoFunction",
            resultPropAlias: "testTwoFunctionDone",
            errorPropAlias: "testTwoFunctionError",
          },
        ],
      }).errorFunctions
    ).toHaveLength(2);
  });
  it("test beccaccinoSelectors without endpoints", () => {
    const beccaccinoSelectors = beccaccinoPropsGenerator({ endpoints: [] });
    expect(beccaccinoSelectors({}, new Date().toISOString())).toEqual({});
  });
  it("test beccaccinoSelectors with endpoints and baseTest to return undefined", () => {
    const beccaccinoSelectors = beccaccinoPropsGenerator({
      endpoints: [
        {
          name: "testFunction",
          resultPropAlias: "testFunctionDone",
          errorPropAlias: "testFunctionError",
        },
      ],
    });
    expect(beccaccinoSelectors(baseState, new Date().toISOString())).toEqual({
      testFunctionDone: undefined,
      testFunctionError: null,
      testFunctionloadingResult: null,
    });
  });
});
