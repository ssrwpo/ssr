import { setMessages, changeLanguage, setEmptyLocalization } from '../../shared/actions';
import { valueSet } from '../../shared/actions/utils';

// Impure function
/* eslint-disable no-param-reassign */
const userAgentAnalysis = (stepResults) => {
  const {
    localization,
    req,
  } = stepResults;
  if (localization) {
    // init localization resources
    stepResults.userLocale = req.acceptsLanguages(localization.languages);
    // set global user language for async translations
    // store.dispatch(changeLanguage(userLocale));
    // if (!localization.async) {
    //   if (localization.language !== userLocale) {
    //     localization.language = userLocale;
    //   }
    //   store.dispatch(setMessages(localization));
    // }
  } else {
    // init empty localization resources
    // store.dispatch(setEmptyLocalization());
  }
};
export default userAgentAnalysis;
