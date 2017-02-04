import React, { PureComponent, PropTypes as pt } from 'react';
import { logger, valueSet, changeLanguage } from 'meteor/ssrwpo:ssr';
import Helmet from 'react-helmet';
import { FormattedMessage, FormattedDate } from 'react-intl';
import pick from 'lodash/pick';
import { connect } from 'react-redux';
import { receiveIntl } from '/imports/actions';


// This function will be called by the server to prepare the store before the
// server-side rendering.

const prepareIntlStore = () => {
  logger.debug('Fetching intl...');
  return fetch('http://localhost:3000/api/translations')
  .then((response) => {
    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }
    logger.debug('Hydrating store with received intl...');
    const messages = response.json();
    console.log('messages', messages);
    return messages;
  });
};


class TranslationsAsync extends PureComponent {
  static propTypes = {
    isIntlInitialised: pt.bool.isRequired,
    intl: pt.object.isRequired,
    setIntl: pt.func.isRequired,
    languageChanger: pt.func.isRequired,
  }

  componentWillMount() {
    // If the data isn't already available (we've come here from another route),
    // then we need to initialise the store.
    const { isIntlInitialised, setIntl } = this.props;
    if (!isIntlInitialised) {
      prepareIntlStore().then((intl) => {
        console.log('inite başladı:', intl)
        setIntl(intl);
        valueSet('isIntlInitialised', true);
      });
    }
  }

  // SSR requirements for this component
  ssr = {
    // If you supply a `prepareStore` function then it will be called to hydrate the store
    // for server-side-rendering. This pre-hydrated store will also be sent with the initial
    // HTML payload.
    //
    // The function may return a promise, in which case the server will wait for it to
    // complete before continuing with the render.
    //
    // In this example we prepare the intl store. Note however that this doesn't mean that
    // the data will necessarily be available on the client. The store will only be pre-hydrated
    // if this component has been rendered on the server. If the client visits this route after
    // the app has been loaded then we'll need to fetch the data when the component mounts.
    // We use a store variable to keep track of this initialised state.
    // eslint-disable-next-line no-unused-vars
    prepareStore: (store, props, context) => {
      const { isIntlInitialised } = store.getState();
      if (!isIntlInitialised) {
        return prepareIntlStore().then((intl) => {
          store.dispatch(receiveIntl(intl));
          valueSet('isIntlInitialised', true);
        });
      }
    /* eslint-enable */
      return null;
    },
  };

  render() {
    const { languageChanger, intl } = this.props;
    return (
      <div>
        <br />
        <button onClick={() => languageChanger('en')}>English</button>
        <button onClick={() => languageChanger('fr')}>Français</button>
        <button onClick={() => languageChanger('tr')}>Türkçe</button>
        <br />
        <Helmet title="Translations Async" />
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
  }
}
TranslationsAsync.propTypes = {
  languageChanger: pt.func.isRequired,
  intl: pt.object.isRequired,
  setIntl: pt.func.isRequired,
  isIntlInitialised: pt.bool.isRequired,
};
const mapStateToProps = state => pick(state, ['intl', 'isIntlInitialised']);
const mapDispatchToProps = dispatch => ({
  languageChanger(language) {
    dispatch(changeLanguage({ language }));
  },
  setIntl: (intl) => { dispatch(receiveIntl(intl)); },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TranslationsAsync);
