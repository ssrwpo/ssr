// Impure function
/* eslint-disable no-param-reassign */
const speakForeignLanguages = (stepResults) => {
  const {
    localization,
    req,
  } = stepResults;
  if (localization) {
    stepResults.userLocale = req.acceptsLanguages(localization.languages);
  }
};
export default speakForeignLanguages;
