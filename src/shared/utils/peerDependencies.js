import { Meteor } from 'meteor/meteor';
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

const sharedPkjs = {
  'is-retina': '1.x',
  lodash: '4.x',
  moment: '2.x',
  pino: '4.x',
  react: '15.x',
  'react-dom': '15.x',
  'react-helmet': '5.x',
  'react-i18next': '2.x',
  'react-redux': '5.x',
  'react-router-dom': '4.x',
  redux: '3.x',
};

if (Meteor.isClient) {
  checkNpmVersions(sharedPkjs, 'ssrwpo:ssr');
}
if (Meteor.isServer) {
  checkNpmVersions(Object.assign({}, sharedPkjs, {
    actual: '0.x',
    express: '4.x',
    helmet: '3.x',
    i18next: '7.x',
    'i18next-express-middleware': '1.x',
    'i18next-node-remote-backend': '0.x',
    'i18next-xhr-backend': '1.x',
    receptacle: '1.x',
    'serialize-javascript': '1.x',
    useragent: '2.x',
  }), 'ssrwpo:ssr');
}
