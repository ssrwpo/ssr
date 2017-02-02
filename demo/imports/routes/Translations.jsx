import React, { PropTypes as pt } from 'react';
import { pure } from 'meteor/ssrwpo:ssr';
import Helmet from 'react-helmet';

const Translations = () => (
  <div>
    <Helmet title="Translations" />
    <h2>Hello</h2>
    <h2> World</h2>
  </div>
);
Translations.propTypes = {
};

export default pure(Translations);
