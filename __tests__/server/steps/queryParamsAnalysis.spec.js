import url from 'url';
// eslint-disable-next-line
import pick from 'lodash/pick';
import queryParamsAnalysis from '../../../server/steps/queryParamsAnalysis';

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

it('selects query for specific routes', () => {
  const testUrl = 'touched';
  const stepResults = {
    url: testUrl,
    hasUnwantedQueryParameters: false,
    req: { query: { somequery: 'somevalue' } },
    urlQueryParameters: {
      [testUrl]: query => pick(query, ['somequery']),
    },
  };
  queryParamsAnalysis(stepResults);
  expect(stepResults.url).to.equal(url.format({ pathname: testUrl, query: stepResults.req.query }));
  expect(stepResults.hasUnwantedQueryParameters).to.be.false();
});
