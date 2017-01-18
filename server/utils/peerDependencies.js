import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

checkNpmVersions({
  express: '4.x',
  helmet: '3.x',
  logatim: '0.x',
  'react-dom': '15.x',
  'react-helmet': '3.x',
  'react-redux': '5.x',
  receptacle: '1.x',
  redux: '3.x',
  useragent: '2.1.x',
  winston: '2.x',
}, 'ssrwpo:ssr');
