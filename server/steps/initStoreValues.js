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
    const userLanguage = req.acceptsLanguages(localization.languages);
    // set global user language for async translations
    global.userLanguage = userLanguage;
    store.dispatch(changeLanguage(userLanguage));
    if (!localization.async) {
      if (localization.language !== userLanguage) {
        localization.language = userLanguage;
      }
      store.dispatch(setMessages(localization));
    }
  } else {
    // init empty localization resources
    store.dispatch(setEmptyLocalization());
  }
};

export default initStoreValues;
