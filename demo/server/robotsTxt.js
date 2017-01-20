import { Meteor } from 'meteor/meteor';

const robotsTxt = () =>
`User-agent: *
Disallow: /protected
Sitemap: ${Meteor.absoluteUrl()}`;

export default robotsTxt;
