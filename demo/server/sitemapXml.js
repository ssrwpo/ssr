import moment from 'moment';

const sitemapDateFormat = 'YYYY-MM-DD';
const header = '<?xml version="1.0" encoding="UTF-8"?>';
const urlsetStart = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
const urlsetStop = '</urlset>';

// changefreq can be: always, hourly, daily, weekly, monthly, yearly, never
// priority: 0.5 when none, ranging from 0 to 1
/* eslint-disable prefer-template */
const urlLoc = ({ slug, lastmod, changefreq, priority }) =>
  '<url>' +
    `<loc>${Meteor.absoluteUrl()}${slug}</loc>` +
    (lastmod ? `<lastmod>${moment(lastmod).format(sitemapDateFormat)}</lastmod>` : '') +
    (changefreq ? `<changefreq>${changefreq}</changefreq>` : '') +
    (priority ? `<priority>${priority}</priority>` : '') +
  '</url>';
/* eslint-enable */

const routeContents = [
  { slug: '', lasmod: new Date(), priority: 1 },
  { slug: 'folks', lasmod: new Date(), priority: 1 },
  { slug: 'places' },
  { slug: 'topics', changefreq: 'daily' },
  { slug: 'topics/rendering', changefreq: 'weekly' },
  { slug: 'topics/components', changefreq: 'weekly' },
  { slug: 'topics/props-v-state', changefreq: 'weekly' },
  { slug: 'about', priority: 0.2 },
].map(routeContent => urlLoc(routeContent))
.join('');

const dynamicRouteContents = store =>
  store.getState().Folks.map(folk => urlLoc({
    slug: `folks?folkId=${folk.id}`,
    lastmod: folk.lastMod,
    priority: 0.7,
  })).join('');

const sitemapXml = store =>
  header + urlsetStart + routeContents + dynamicRouteContents(store) + urlsetStop;

export default sitemapXml;
