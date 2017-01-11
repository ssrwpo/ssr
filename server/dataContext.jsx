import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import { EJSON } from 'meteor/ejson';

checkNpmVersions({
  react: '15.x',
  'react-dom': '15.x',
}, 'ssrwpo:ssr');

/* eslint-disable import/no-unresolved, import/no-extraneous-dependencies */
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
/* eslint-enable */

const createDataContext = () => {
  const dataContext = { someItems: ['Hello', 'world'] };
  const serializedDataContext = EJSON.stringify(dataContext);
  /* eslint-disable react/no-danger */
  return {
    dataContext,
    dataMarkup: renderToStaticMarkup(
      <script
        dangerouslySetInnerHTML={{
          __html: `window.initialReactContext='${serializedDataContext}';`,
        }}
      />,
    ),
  };
  /* eslint-enable */
};
export default createDataContext;
