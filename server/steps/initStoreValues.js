import { url as urlActions, setMessages, changeLanguage, setEmptyLocalization } from '../../shared/actions';
import { valueSet } from '../../shared/actions/utils';

const initStoreValues = (stepResults) => {
  const {
    platformTransformers,
    store,
    url,
    userAgent,
    localization,
    req,
  } = stepResults;

  store.dispatch(valueSet('platform', userAgent));

  if (platformTransformers) {
    platformTransformers(store.dispatch, userAgent);
  }

  store.dispatch(urlActions.set(url));
  if (localization) {
    // init localization resources
    const usersLanguage = req.acceptsLanguages(localization.languages);
    if (localization.language) {
      store.dispatch(
        /* eslint-disable */
          changeLanguage(usersLanguage ? usersLanguage : localization.language),
        /* eslint-enable */
      );
    } else {
      store.dispatch(
        /* eslint-disable */
          changeLanguage(usersLanguage ? usersLanguage : localization.fallback),
        /* eslint-enable */
      );
    }
    store.dispatch(setMessages(localization));
  } else {
    // init empty localization resources
    // store.dispatch(setEmptyLocalization());
  }
};

export default initStoreValues;
