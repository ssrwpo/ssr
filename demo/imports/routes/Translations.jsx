import React, { PropTypes } from 'react';
import { pure } from 'meteor/ssrwpo:ssr';
import Helmet from 'react-helmet';
import { translate } from 'react-i18next';

const Translations = ({ t }) => (
  <div>
    <Helmet title="Translations" />
    <h2>{t('hello')}</h2>
  </div>
);
Translations.propTypes = {
  t: PropTypes.func.isRequired,
};

export default translate()(pure(Translations));
