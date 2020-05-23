import { getRoutes } from "./getRoutes";

type Response = {
  statusCode: number;
  body: string;
};

export const getRoutesListener = (): Promise<Response> => {
  return getRoutes()
    .then(routes => {
      return {
        body: JSON.stringify(routes),
        statusCode: 200
      };
    })
    .catch(() => ({
      statusCode: 500,
      body: "[]"
    }));
};
