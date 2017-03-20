import sitemapFromArray from '../../../src/server/utils/sitemaps';

it('creates a sitemap from an array', () => {
  const testCase = [{ slug: '/' }];
  expect(sitemapFromArray(testCase)).to.equal(
    '<?xml version="1.0" encoding="UTF-8"?>' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      '<url>' +
        '<loc>https://www.example.com/</loc>' +
      '</url>' +
    '</urlset>',
  );
});

it('supports images extensions for sitemaps', () => {
  const testCase = [{ slug: '/' }];
  expect(sitemapFromArray(testCase, { hasImages: true })).to.equal(
    '<?xml version="1.0" encoding="UTF-8"?>' +
      '<urlset ' +
        'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' +
      '>' +
      '<url>' +
        '<loc>https://www.example.com/</loc>' +
      '</url>' +
    '</urlset>',
  );
});
