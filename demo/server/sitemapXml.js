import { Meteor } from 'meteor/meteor';
import sm from 'sitemap';

const sitemap = sm.createSitemap({
  hostname: Meteor.absoluteUrl(),
  cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  urls: [
    { url: '', lastmod: new Date(), priority: 1 },
    { url: 'folks', lastmod: new Date(), priority: 1 },
    { url: 'places' },
    { url: 'topics', changefreq: 'daily' },
    { url: 'topics/rendering', changefreq: 'weekly' },
    { url: 'topics/components', changefreq: 'weekly' },
    { url: 'topics/props-v-state', changefreq: 'weekly' },
    { url: 'about', priority: 0.2 },
  ],
});

let dynamicRoutes = null;

const sitemapXml = (store) => {
  // Remove former dynamic routes
  if (dynamicRoutes) dynamicRoutes.forEach(r => sitemap.del(r.url));
  // Determine dynamic routes based on current store value
  dynamicRoutes = store.getState().Folks.map(folk => ({
    url: `folks?folkId=${folk.id}`, lastmod: new Date(folk.lastMod), priority: 0.7,
  }));
  // Add dynamic routes
  dynamicRoutes.forEach(r => sitemap.add(r));
  return sitemap.toString();
};

export default sitemapXml;
