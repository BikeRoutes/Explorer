import * as t from "io-ts";
import { GraphQLClient } from "graphql-request";
import { failure } from "io-ts/lib/PathReporter";
import { tryCatch, TaskEither } from "fp-ts/lib/TaskEither";
import * as taskEither from "fp-ts/lib/TaskEither";

const graphqlClient = new GraphQLClient("https://api.github.com/graphql", {
  headers: {
    Authorization: `bearer ${process.env.TOKEN}`
  }
});

export const query = <A>(
  query: string,
  values: { [k: string]: any },
  responseType: t.Type<A>
): TaskEither<string, A> => {
  return tryCatch(
    () => graphqlClient.request<unknown>(query, values),
    (e: any) =>
      `Github graphql API response error for query "${query
        .split("\n")[1]
        .trim()} ... }":\n${JSON.stringify(e.message)}`
  ).chain((res) => {
    return taskEither
      .fromEither(responseType.decode(res))
      .mapLeft(
        (errors) =>
          `Error while validating response type:\n${failure(errors).join("\n")}`
      );
  });
};

export const contents = `
{
  repository(name: "BikeRoutes", owner: "BikeRoutes") {
    object(expression: "master:") {
      ... on Tree {
        entries {
          name
          type
          object {
            ... on Tree {
              entries {
                name
                type
                object {
                  ... on Tree {
                    entries {
                      name
                      type
                      object {
                        ... on Tree {
                          entries {
                            name
                            type
                            object {
                              ... on Blob {
                                isTruncated
                                text
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  rateLimit {
    cost
    limit
  }
}
`;

export type BlobEntry = {
  name: string;
  type: "blob";
  object: {
    isTruncated: boolean;
    text: string;
  };
};

export type ContentEntry =
  | {
      name: string;
      type: "tree";
      object: {
        entries: ContentEntry[];
      };
    }
  | BlobEntry;

export const Contents = t.type({
  repository: t.type({
    object: t.type({
      entries: t.array(
        t.union([
          t.type({
            name: t.string,
            type: t.literal("tree"),
            object: t.type({
              entries: t.array(
                t.union([
                  t.type({
                    name: t.string,
                    type: t.literal("tree"),
                    object: t.type({
                      entries: t.array(
                        t.union([
                          t.type({
                            name: t.string,
                            type: t.literal("tree"),
                            object: t.type({
                              entries: t.array(
                                t.type({
                                  name: t.string,
                                  type: t.literal("blob"),
                                  object: t.type({
                                    text: t.string,
                                    isTruncated: t.boolean
                                  })
                                })
                              )
                            })
                          }),
                          t.type({
                            name: t.string,
                            type: t.literal("blob"),
                            object: t.type({})
                          })
                        ])
                      )
                    })
                  }),
                  t.type({
                    name: t.string,
                    type: t.literal("blob"),
                    object: t.type({})
                  })
                ])
              )
            })
          }),
          t.type({
            name: t.string,
            type: t.literal("blob"),
            object: t.type({})
          })
        ])
      )
    })
  })
});

export type Contents = t.TypeOf<typeof Contents>;
