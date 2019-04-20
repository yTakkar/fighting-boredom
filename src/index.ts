interface CacheAdapterTypeClass {
  getItem(k: string): Promise<any>;
  setItem(k: string, v: any): Promise<any>;
}

interface GraphQLRequest<T> {
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

type RequestHandlerFunction = (req: GraphQLRequest<any>) => Promise<GraphQLResponse<any>>;

type Options = {
  endpoint: string;
  cacheAdapter?: CacheAdapterTypeClass;
  makeRequest?: RequestHandlerFunction;
};

export default function GraphQL({ endpoint }: Options) {
  console.log('>> wow', endpoint);
}
