interface CacheAdapterTypeClass {
  getItem(k: string): Promise<any>;
  setItem(k: string, v: any): Promise<any>;
}

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
  run<T>(variables?: T): Promise<GraphQLResponse<T>>
}

interface Fragment {
  name: string
  toString(): string
}

type Options = {
  url: string;
  cacheAdapter?: CacheAdapterTypeClass;
  makeRequest?<T>(req: GraphQLRequest<any>): Promise<GraphQLResponse<T>>;
};

function makeFetchRequest<T>({ query, variables }: GraphQLRequest<any>): Promise<GraphQLResponse<T>> {
  return Promise.resolve({});
}

export default function GraphQL({ url, makeRequest = makeFetchRequest }: Options) {

  function createQueryParser() {
    function evaluateInterlop(query: string, queryFrag: string, value: any) {
      if (value == null) return query + queryFrag;
      // TODO: handle interlop Fragment
      return query + queryFrag + value;
    }

    return function q(strFrags: TemplateStringsArray, ...args: Array<Fragment|any>): QueryParser {
      const query = strFrags.reduce((query, strFrag, index) => {
        return evaluateInterlop(query, strFrag, args[index]);
      }, '');

      // Minification of final query
      const minifiedQuery = query.replace(/\s+/g, ' ').trim();

      return {
        run:<T> (variables?: T) => makeRequest<T>({ url, query: minifiedQuery, variables }),
      };
    };
  }

  function createFragment(): Fragment {
    return function fragment(strFrags: TemplateStringsArray, ...args: Array<Fragment|any>) {
      return {
        name: '<Fragmentname>',
        toString: () => '',
      };
    }
  }

  return {
    query: createQueryParser(),
    fragment: createFragment(),
  };
}
