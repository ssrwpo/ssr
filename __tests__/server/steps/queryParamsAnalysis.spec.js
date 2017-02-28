import url from 'url';
// eslint-disable-next-line
import pick from 'lodash/pick';
import queryParamsAnalysis from '../../../src/server/steps/queryParamsAnalysis';

it('doesn\'t modify query when no analyser is provided', () => {
  const testUrl = 'untouched';
  const stepResults = { url: testUrl, hasUnwantedQueryParameters: false };
  queryParamsAnalysis(stepResults);
  expect(stepResults.url).to.equal(testUrl);
  expect(stepResults.hasUnwantedQueryParameters).to.be.false();
});

it('doesn\'t filter query when no filter is provided in the analyser', () => {
  const testUrl = 'untouched';
  const stepResults = {
    url: testUrl,
    hasUnwantedQueryParameters: false,
    req: { query: { somequery: 'somevalue' } },
    urlQueryParameters: {},
  };
  queryParamsAnalysis(stepResults);
  expect(stepResults.url).to.equal(testUrl);
  expect(stepResults.hasUnwantedQueryParameters).to.be.false();
});

it('selects and sorts query for specific routes', () => {
  const testUrl = 'touched';
  const stepResults = {
    url: testUrl,
    hasUnwantedQueryParameters: false,
    req: { query: { somequery2: 'somevalue', somequery1: 'somevalue', unwanted: 'unwanted' } },
    urlQueryParameters: {
      [testUrl]: query => pick(query, ['somequery2', 'somequery1']),
    },
  };
  queryParamsAnalysis(stepResults);
  expect(stepResults.url).to.equal(url.format({
    pathname: testUrl,
    query: { somequery1: 'somevalue', somequery2: 'somevalue' },
  }));
  expect(stepResults.hasUnwantedQueryParameters).to.be.false();
});

it('specifies an unwanted value for a query', () => {
  const testUrl = 'untouched';
  const stepResults = {
    url: testUrl,
    hasUnwantedQueryParameters: false,
    req: { query: { somequery: 'unwanted' } },
    urlQueryParameters: {
      [testUrl]: () => null,
    },
  };
  queryParamsAnalysis(stepResults);
  expect(stepResults.url).to.equal(testUrl);
  expect(stepResults.hasUnwantedQueryParameters).to.be.true();
});
