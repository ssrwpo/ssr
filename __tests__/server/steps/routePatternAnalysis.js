import routePatternAnalysis from '../../../src/server/steps/routePatternAnalysis';

const routePatterns = [
  '/',
  '/home',
  '/:locale',
  '/:locale/index',
  '/:locale/index/:id',
  '/contact',
];

it('does match with pattern', () => {
  const stepResults = {
    req: {
      params: {},
      path: '/',
    },
    routePattern: null,
  };
  routePatternAnalysis(stepResults, routePatterns);

  expect(stepResults.routePattern).to.equal('/');
});
