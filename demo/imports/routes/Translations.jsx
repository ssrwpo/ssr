import React, { PropTypes as pt } from 'react';
import { pure } from 'meteor/ssrwpo:ssr';
import Helmet from 'react-helmet';
import { translate } from 'react-i18next';

const Translations = ({ t }) => (
  <div>
    <Helmet><title>Translations</title></Helmet>
    <h2>{t('common:hello')}</h2>
    <h2> {t('greetings:world')}</h2>
  </div>
);
Translations.propTypes = {
  t: pt.func.isRequired,
};

export default translate(['common', 'greetings'])(pure(Translations));
