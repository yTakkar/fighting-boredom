import GraphQL from '../src';

describe('GraphQL', () => {
  let mockMakeRequest = jest.fn(() => Promise.resolve({}));

  afterEach(() => {
    mockMakeRequest.mockClear();
  });

  it('should create an instance without errors', () => {
    GraphQL({
      url: 'https://someapi.com/graphql',
      makeRequest: mockMakeRequest,
    });
  });
});

describe('Query instance', () => {
  let mockMakeRequest = jest.fn((request) => Promise.resolve(request));

  afterEach(() => {
    mockMakeRequest.mockClear();
  });

  it('should return a gql instance', async () => {
    const gql = GraphQL({
      url: 'https://someapi.com/graphql',
      makeRequest: mockMakeRequest,
    });

    const hwQuery = gql.query`
      query HelloWorld {
        hello
        world
      }
    `;

    const resp = await hwQuery.run<any>();

    expect(mockMakeRequest).toHaveBeenCalledTimes(1);
    expect(resp).toEqual({
      url: 'https://someapi.com/graphql',
      variables: undefined,
      query: `query HelloWorld { hello world }`,
    });
  });


  it('should interpolate the string and return gql instance', async () => {
    const gql = GraphQL({
      url: 'https://someapi.com/graphql',
      makeRequest: mockMakeRequest,
    });

    const hwQuery = gql.query`
      query HelloWorld {
        hello
        ${'world'}
      }
    `;

    const resp = await hwQuery.run<any>();

    expect(mockMakeRequest).toHaveBeenCalledTimes(1);
    expect(resp).toEqual({
      url: 'https://someapi.com/graphql',
      variables: undefined,
      query: `query HelloWorld { hello world }`,
    });
  });
});
