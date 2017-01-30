// eslint-disable-next-line
import pick from 'lodash/pick';
import queryParamsAnalysis from '../../../server/steps/queryParamsAnalysis';

it('doesn\'t modify query when no analyser is provided', () => {
  const testUrl = 'untouched';
  const stepResults = {
    hasUnwantedQueryParameters: false,
    req: {
      params: {},
      query: {},
    },
    routePattern: testUrl,
    routes: {},
  };
  queryParamsAnalysis(stepResults);
  expect(stepResults.hasUnwantedQueryParameters).to.be.false();
});

it('doesn\'t filter query when no filter is provided in the analyser', () => {
  const testUrl = 'untouched';
  const stepResults = {
    hasUnwantedQueryParameters: false,
    req: {
      params: {},
      query: { somequery: 'somevalue' },
    },
    routePattern: testUrl,
    routes: { [testUrl]: {} },
  };
  queryParamsAnalysis(stepResults);
  expect(stepResults.hasUnwantedQueryParameters).to.be.false();
});

it('selects and sorts query params for specific routes', () => {
  const testUrl = 'touched';
  const stepResults = {
    hasUnwantedQueryParameters: false,
    req: {
      params: {},
      query: {
        somequery2: 'somevalue',
        somequery1: 'somevalue',
        unwanted: 'unwanted',
      },
    },
    routePattern: testUrl,
    routes: {
      [testUrl]: {
        urlQueryParameters: (params, query) => pick(query, [
          'somequery2',
          'somequery1',
        ]),
      },
    },
  };
  queryParamsAnalysis(stepResults);
  expect(stepResults.sortedQuery).to.deep.equal({
    somequery1: 'somevalue',
    somequery2: 'somevalue',
  });
  expect(stepResults.hasUnwantedQueryParameters).to.be.false();
});

it('selects and sorts url params for specific routes', () => {
  const testUrl = 'touched';
  const stepResults = {
    hasUnwantedQueryParameters: false,
    req: {
      params: {
        someparams2: 'somevalue',
        someparams1: 'somevalue',
        unwanted: 'unwanted',
      },
      query: {},
    },
    routePattern: testUrl,
    routes: {
      [testUrl]: {
        urlQueryParameters: params => pick(params, [
          'someparams2',
          'someparams1',
        ]),
      },
    },
  };
  queryParamsAnalysis(stepResults);
  expect(stepResults.sortedQuery).to.deep.equal({
    someparams1: 'somevalue',
    someparams2: 'somevalue',
  });
  expect(stepResults.hasUnwantedQueryParameters).to.be.false();
});

it('selects and sorts url and query params for specific routes', () => {
  const testUrl = 'touched';
  const stepResults = {
    hasUnwantedQueryParameters: false,
    req: {
      params: {
        someparams2: 'somevalue',
        someparams1: 'somevalue',
        unwanted2: 'unwanted',
      },
      query: {
        somequery2: 'somevalue',
        somequery1: 'somevalue',
        unwanted: 'unwanted',
      },
    },
    routePattern: testUrl,
    routes: {
      [testUrl]: {
        urlQueryParameters: (params, query) => {
          const fromParams = pick(params, ['someparams2', 'someparams1']);
          const fromQuery = pick(query, ['somequery2', 'somequery1']);
          return Object.assign(fromQuery, fromParams);
        },
      },
    },
  };
  queryParamsAnalysis(stepResults);
  expect(stepResults.sortedQuery).to.deep.equal({
    someparams1: 'somevalue',
    someparams2: 'somevalue',
    somequery1: 'somevalue',
    somequery2: 'somevalue',
  });
  expect(stepResults.hasUnwantedQueryParameters).to.be.false();
});

it('specifies an unwanted value for a query', () => {
  const testUrl = 'untouched';
  const stepResults = {
    hasUnwantedQueryParameters: false,
    req: {
      params: {},
      query: { somequery: 'unwanted' },
    },
    routePattern: testUrl,
    routes: {
      [testUrl]: { urlQueryParameters: () => null },
    },
  };
  queryParamsAnalysis(stepResults);
  expect(stepResults.hasUnwantedQueryParameters).to.be.true();
});

it('specifies an unwanted value for a url params', () => {
  const testUrl = 'untouched';
  const stepResults = {
    hasUnwantedQueryParameters: false,
    req: {
      params: { someparams: 'unwanted' },
      query: {},
    },
    routePattern: testUrl,
    routes: {
      [testUrl]: { urlQueryParameters: () => null },
    },
  };
  queryParamsAnalysis(stepResults);
  expect(stepResults.hasUnwantedQueryParameters).to.be.true();
});
