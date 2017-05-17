'use strict';   // eslint-disable-line strict, lines-around-directive

const name = 'ssrwpo:ssr';
Package.describe({
  name,
  version: '3.0.0',
  summary: 'SSR - Router with SSR for Node & Meteor',
  git: 'https://github.com/ssr-server/ssr',
  documentation: 'README.md',
});

// Packages used on client and server
const sharedPkgs = [
  // MDG packages
  'ecmascript', 'ejson', 'webapp',
  // Community packages
  'tmeasday:check-npm-versions@0.3.1',
];

Package.onUse((api) => {
  api.versionsFrom('1.4.4.2');
  api.use(sharedPkgs);
  api.mainModule('shared/utils/peerDependencies.js', ['client', 'server']);
  api.mainModule('client/index.js', 'client');
  api.mainModule('server/index.js', 'server');
});
