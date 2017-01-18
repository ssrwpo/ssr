import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

checkNpmVersions({
  react: '15.x',
  'react-dom': '15.x',
  'react-redux': '5.x',
  logatim: '0.x',
}, 'ssrwpo:ssr');

/* eslint-disable import/no-unresolved, import/no-extraneous-dependencies */
const logatim = require('logatim');
const React = require('react');
const { render } = require('react-dom');
const { Provider } = require('react-redux');
/* eslint-enable */

export {
  React,
  render,
  Provider,
  logatim,
};
