import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

checkNpmVersions({
  actual: '0.x',
  express: '4.x',
  helmet: '3.x',
  i18next: '7.x',
  'i18next-express-middleware': '1.x',
  'i18next-node-remote-backend': '0.0.x',
  'i18next-xhr-backend': '1.3.x',
  lodash: '4.x',
  logatim: '0.x',
  moment: '2.x',
  'react-dom': '15.x',
  'react-helmet': '4.x',
  'react-i18next': '2.x',
  'react-redux': '5.x',
  'react-router-dom': '4.0.0-beta.5',
  receptacle: '1.x',
  redux: '3.x',
  'serialize-javascript': '1.x',
  useragent: '2.1.x',
  winston: '2.x',
}, 'ssrwpo:ssr');
