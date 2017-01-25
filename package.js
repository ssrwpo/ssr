'use strict';   // eslint-disable-line strict, lines-around-directive

const name = 'ssrwpo:ssr';
Package.describe({
  name,
  version: '1.4.1',
  summary: 'SSR - Router with SSR for Node & Meteor',
  git: 'https://github.com/ssr-server/ssr',
  documentation: 'README.md',
});

const pkgs = [
  // MDG packages
  'ecmascript', 'ejson', 'webapp', 'mongo', 'tracker',
  // Community packages
  'tmeasday:check-npm-versions@0.3.1',
];
Package.onUse((api) => {
  api.versionsFrom('1.4.2.3');
  api.use(pkgs);
  api.mainModule('client/index.jsx', 'client');
  api.mainModule('server/index.js', 'server');
});
