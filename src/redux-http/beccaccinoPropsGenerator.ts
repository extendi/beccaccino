import { resultSelector, errorSelector, loadingSelector } from "./index";

type GeneratorEndpoints = {
  endpoints: Array<{
    name: string;
    resultPropAlias?: string;
    errorPropAlias?: string;
    loadingPropAlias?: string;
  }>;
};

export const returnBeccaccinoResults = ({ endpoints }: GeneratorEndpoints) =>
  endpoints.reduce(
    (acc, curr) => ({
      ...acc,
      resultFunctions: [
        ...acc.resultFunctions,
        (state: any, sessionId: string) => {
          const httpResult = resultSelector({
            sessionId,
            state,
            limit: -1,
            endpointName: curr.name,
          });
          return {
            [curr.resultPropAlias || `${curr.name}responseResult`]:
              httpResult && httpResult[0] ? httpResult[0] : undefined,
          };
        },
      ],
      errorFunctions: [
        ...acc.errorFunctions,
        (state: any, sessionId: string) => {
          const httpResult = errorSelector({
            sessionId,
            state,
            limit: -1,
            endpointName: curr.name,
          });
          return {
            [curr.errorPropAlias || `${curr.name}errorResult`]:
              httpResult && httpResult[0].error && httpResult[0],
          };
        },
      ],
      loadingFunctions: [
        ...acc.loadingFunctions,
        (state: any, sessionId: string) => {
          const httpResult = loadingSelector({
            sessionId,
            state,
            limit: -1,
            endpointName: curr.name,
          });
          return {
            [curr.loadingPropAlias || `${curr.name}loadingResult`]:
              httpResult && httpResult[0],
          };
        },
      ],
    }),
    {
      resultFunctions: [],
      loadingFunctions: [],
      errorFunctions: [],
    }
  );

export const beccaccinoPropsGenerator = ({ endpoints }: GeneratorEndpoints) => {
  const beccaccinoResults = returnBeccaccinoResults({ endpoints });
  return (state: any, sessionId: string) => {
    const allSelectors = [
      ...beccaccinoResults.errorFunctions,
      ...beccaccinoResults.loadingFunctions,
      ...beccaccinoResults.resultFunctions,
    ];
    return allSelectors.reduce(
      (acc, curr) => ({
        ...acc,
        ...curr(state, sessionId),
      }),
      {}
    );
  };
};
