// Impure function
const speakForeignLanguages = (stepResults) => {
  const { localization, req } = stepResults;
  // eslint-disable-next-line no-param-reassign
  if (localization) stepResults.userLocale = req.acceptsLanguages(localization.languages);
};
export default speakForeignLanguages;
