'use strict';   // eslint-disable-line strict, lines-around-directive

const name = 'ssrwpo:ssr';
Package.describe({
  name,
  version: '0.0.1',
  summary: 'SSR - Router with SSR for Node & Meteor',
  git: 'https://github.com/ssr-server/ssr',
  documentation: 'README.md',
});

const pkgs = ['ecmascript'];
Package.onUse((api) => {
  api.versionsFrom('1.4.2.3');
  api.use(pkgs);
  api.mainModule('ssr.js');
});

Package.onTest((api) => {
  api.use(pkgs.concat(['tinytest', name]));
  api.mainModule('ssr-tests.js');
});
