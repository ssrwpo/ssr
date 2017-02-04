import React, { PropTypes as pt } from 'react';
import { pure, changeLanguage } from 'meteor/ssrwpo:ssr';
import Helmet from 'react-helmet';
import { FormattedMessage, FormattedDate } from 'react-intl';
import pick from 'lodash/pick';
import { connect } from 'react-redux';

const Translations = ({ languageChanger, intl }) => (
  <div>
    <br />
    <button onClick={() => languageChanger('en')}>English</button>
    <button onClick={() => languageChanger('fr')}>Français</button>
    <button onClick={() => languageChanger('tr')}>Türkçe</button>
    <br />
    <Helmet title="Translations" />
    <p>
      <FormattedMessage
        id="app.currentLanguage"
        values={{ language: intl.locale }}
      />
    </p>
    <h2><FormattedMessage id="app.greeting" defaultMessage="你好!" /></h2>
    <h3>
      <FormattedDate
        value={new Date()}
        year="numeric"
        month="long"
        day="numeric"
        weekday="long"
      />
    </h3>
  </div>
);
Translations.propTypes = {
  languageChanger: pt.func.isRequired,
  intl: pt.object.isRequired,
};
const mapStateToProps = state => pick(state, ['intl']);
const mapDispatchToProps = dispatch => ({
  languageChanger(language) {
    dispatch(changeLanguage({ language }));
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(pure(Translations));
