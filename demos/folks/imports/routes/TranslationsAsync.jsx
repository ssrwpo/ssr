import React, { PureComponent, PropTypes as pt } from 'react';
import { logger, valueSet } from 'meteor/ssrwpo:ssr';
import Helmet from 'react-helmet';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { connect } from 'react-redux';
import { receiveIntl } from '/imports/actions';


// This function will be called by the server to prepare the store before the
// server-side rendering.

const prepareIntlMessages = () => {
  logger.debug('Fetching intl messages...');
  return fetch('http://demo2587166.mockable.io/translations')
  .then((response) => {
    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }
    logger.debug('Hydrating store with received intl messages...');
    const messages = response.json();
    return messages;
  });
};


class TranslationsAsync extends PureComponent {
  static propTypes = {
    isIntlInitialised: pt.bool.isRequired,
    intl: pt.object.isRequired,
    setIntlInitialised: pt.func.isRequired,
    setIntl: pt.func.isRequired,
    languageChanger: pt.func.isRequired,
  }

  // SSR requirements for this component
  static ssr = {
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
    // It's important to use a store variable to prevent this call from being made twice, since
    // it'll be hoisted up into the `connect` HOC.
    prepareStore: (store) => {
      const { isIntlInitialised, intl } = store.getState();
      if (!isIntlInitialised) {
        return prepareIntlMessages().then((messages) => {
          store.dispatch(receiveIntl({
            messages,
            language: intl ? intl.locale : 'en',
          }));
          store.dispatch(valueSet('isIntlInitialised', true));
        });
      }
    /* eslint-enable */
      return null;
    },
  };

  componentWillMount() {
    // If the data isn't already available (we've come here from another route),
    // then we need to initialise the store.
    // We mustn't do this on the server because the SSR won't wait for it to complete.
    // Instead, we use `prepareIntlMessages` on the `ssr` configuration above.
    const { isIntlInitialised, setIntlInitialised, setIntl, intl } = this.props;
    if (Meteor.isClient && !isIntlInitialised) {
      prepareIntlMessages().then((messages) => {
        setIntl({
          messages,
          language: intl ? intl.locale : 'en',
        });
        setIntlInitialised();
      });
    }
  }

  render() {
    const { languageChanger, intl, isIntlInitialised } = this.props;
    return (
      <div>
        <h2>Translation from Rest API</h2>
        <br />
        <button onClick={() => languageChanger('en')}>English</button>
        <button onClick={() => languageChanger('fr')}>Français</button>
        <button onClick={() => languageChanger('tr')}>Türkçe</button>
        <br />
        <Helmet title="Translations Async" />
        { !isIntlInitialised ?
          <p>loading...</p> :
          <div>
            <p>
              <FormattedMessage
                id="app.currentLanguage"
                values={{ language: intl.locale }}
              />
            </p>
            <h2><FormattedMessage id="app.greetings" defaultMessage="你好!" /></h2>
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
        }
      </div>
    );
  }
}

export default connect(
  state => ({
    isIntlInitialised: state.isIntlInitialised,
    intl: state.intl,
  }),
  dispatch => ({
    languageChanger(language) {
      dispatch(valueSet('isIntlInitialised', false));
      return prepareIntlMessages().then((messages) => {
        dispatch(receiveIntl({ messages, language }));
        dispatch(valueSet('isIntlInitialised', true));
      });
    },
    setIntlInitialised: () => { dispatch(valueSet('isIntlInitialised', true)); },
    setIntl: (payload) => { dispatch(receiveIntl(payload)); },
  }),
)(TranslationsAsync);