import { Meteor } from 'meteor/meteor';
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

const sharedPkjs = {
  'is-retina': '1.x',
  lodash: '4.x',
  moment: '2.x',
  'prop-types': '15.x',
  react: '15.x',
  'react-dom': '15.x',
  'react-helmet': '5.x',
  'react-intl': '2.x',
  'react-intl-redux': '0.x',
  'react-redux': '5.x',
  'react-router-dom': '4.x',
  redux: '3.x',
  'styled-components': '2.x',
};

if (Meteor.isClient) {
  checkNpmVersions(sharedPkjs, 'ssrwpo:ssr');
}
if (Meteor.isServer) {
  checkNpmVersions(Object.assign({}, sharedPkjs, {
    actual: '0.x',
    'electrode-react-ssr-caching': '0.x',
    express: '4.x',
    farmhash: '1.x',
    helmet: '3.x',
    'html-minifier': '3.x',
    intl: '1.x',
    receptacle: '1.x',
    'url-pattern': '1.x',
    useragent: '2.x',
  }), 'ssrwpo:ssr');
}
