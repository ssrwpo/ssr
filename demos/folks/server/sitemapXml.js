import { sitemapFromArray } from 'meteor/ssrwpo:ssr';

const staticRouteContents = [
  { slug: '', lastmod: new Date(), priority: 1 },
  { slug: 'folks', lastmod: new Date(), priority: 1 },
  { slug: 'places' },
  { slug: 'topics', changefreq: 'daily' },
  { slug: 'topics/rendering', changefreq: 'weekly' },
  { slug: 'topics/components', changefreq: 'weekly' },
  { slug: 'topics/props-v-state', changefreq: 'weekly' },
  { slug: 'about', priority: 0.2 },
];

const dynamicRouteContents = store =>
  store.getState().Folks.map(folk => ({
    slug: `folks?folkId=${folk.id}`,
    lastmod: folk.lastMod,
    priority: 0.7,
  }));

const sitemapXml = store =>
  sitemapFromArray([
    ...staticRouteContents,
    ...dynamicRouteContents(store),
  ]);

export default sitemapXml;
