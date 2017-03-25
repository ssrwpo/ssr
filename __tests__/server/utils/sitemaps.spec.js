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
  const testCase = [{
    slug: '/',
    images: [
      { loc: 'http://example.com/image.jpg' },
      {
        loc: 'http://example.com/photo.jpg',
        caption: 'Some legend',
        geo_location: 'Somewhere',
        title: 'Some title',
        license: 'Do whaetever you want with it',
      },
    ],
  }];
  expect(sitemapFromArray(testCase, { hasImages: true })).to.equal(
    '<?xml version="1.0" encoding="UTF-8"?>' +
      '<urlset ' +
        'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
        'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' +
      '>' +
      '<url>' +
        '<loc>https://www.example.com/</loc>' +
        '<image:image>' +
          '<image:loc>http://example.com/image.jpg</image:loc>' +
        '</image:image>' +
        '<image:image>' +
          '<image:loc>http://example.com/photo.jpg</image:loc>' +
          '<image:caption>Some legend</image:caption>' +
          '<image:geo_location>Somewhere</image:geo_location>' +
          '<image:title>Some title</image:title>' +
          '<image:license>Do whaetever you want with it</image:license>' +
        '</image:image>' +
      '</url>' +
    '</urlset>',
  );
});
