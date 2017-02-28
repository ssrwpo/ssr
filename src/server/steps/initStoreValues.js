import { url as urlActions } from '../../shared/actions';
import { valueSet } from '../../shared/actions/utils';
import { setMessages } from '../../shared/actions';

const initStoreValues = (stepResults) => {
  const {
    platformTransformers,
    store,
    url,
    userAgent,
    userLocale,
    localization,
  } = stepResults;

  store.dispatch(valueSet('platform', userAgent));
  store.dispatch(valueSet('userLocale', userLocale));

  if (localization) {
    if (!localization.async) {
      store.dispatch(setMessages({
        messages: localization.messages,
        locale: userLocale,
        languages: localization.languages,
        fallback: localization.fallback,
      }));
    }
  }

  if (platformTransformers) {
    platformTransformers(store.dispatch, userAgent);
  }

  store.dispatch(urlActions.set(url));
};

export default initStoreValues;
