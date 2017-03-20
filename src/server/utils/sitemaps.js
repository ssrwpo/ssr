/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import moment from 'moment';
import { Meteor } from 'meteor/meteor';
/* eslint-enable */

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

const sitemapFromArray = routes =>
  header
  + urlsetStart
  + routes.map(route => urlLoc(route)).join('')
  + urlsetStop;

export default sitemapFromArray;
