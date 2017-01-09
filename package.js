'use strict';

const name = 'ssrwpo:ssr';

Package.describe({
  name,
  version: '0.0.1',
  summary: 'SSR - Router with SSR for Node & Meteor',
  git: 'https://github.com/ssr-server/ssr',
  documentation: 'README.md'
});

const pkgs = ['ecmascript'];

Package.onUse(function(api) {
  api.versionsFrom('1.4.2.3');
  api.use(pkgs);
  api.mainModule('ssr.js');
});

Package.onTest(function(api) {
  api.use(pkgs.concact([
    'tinytest', name,
  ]))
  api.mainModule('ssr-tests.js');
});
