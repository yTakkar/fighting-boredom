import { stripWhitespace } from './utils';

import { CacheAdapterTypeClass } from './CacheAdapter';

interface GraphQLRequest<T> {
  url: string;
  query: string;
  variables?: T;
  operationName?: string;
  headers?: { [key: string]: string };
}

interface GraphQLError {
  message: string;
  locations: Array<{ lint: number; column: number }>;
  path: Array<any>;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<GraphQLError>;
}

interface QueryParser {
  run<V, R>(variables?: V): Promise<GraphQLResponse<R>>;
}

interface Fragment {
  name: string;
  toString(): string;
}

type Options = {
  url: string;
  cacheAdapter?: CacheAdapterTypeClass<any>;
  makeRequest?<V, R>(req: GraphQLRequest<V>): Promise<GraphQLResponse<R>>;
};

function makeFetchRequest<V, R>({ query, variables }: GraphQLRequest<V>): Promise<GraphQLResponse<R>> {
  return Promise.resolve({});
}

function evaluateInterlop(query: string, queryFrag: string, value: any) {
  if (value == null) return query + queryFrag;
  // TODO: handle interlop Fragment
  return query + queryFrag + value;
}

export default function GraphQL({ url, makeRequest = makeFetchRequest }: Options) {
  function createQueryParser() {
    return function q(strFrags: TemplateStringsArray, ...args: Array<Fragment | any>): QueryParser {
      const query = strFrags.reduce((query, strFrag, index) => {
        return evaluateInterlop(query, strFrag, args[index]);
      }, '');

      // Minification of final query
      const minifiedQuery = stripWhitespace(query);

      return {
        run: <V, R>(variables?: V) => makeRequest<V, R>({ url, query: minifiedQuery, variables }),
      };
    };
  }

  function createFragment(): Fragment {
    return function fragment(strFrags: TemplateStringsArray, ...args: Array<Fragment | any>) {
      return {
        name: '<Fragmentname>',
        toString: () => '',
      };
    };
  }

  return {
    query: createQueryParser(),
    fragment: createFragment(),
  };
}
