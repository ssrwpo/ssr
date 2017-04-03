import { Meteor } from 'meteor/meteor';
import en from './en';
import fr from './fr';
import tr from './tr';

const messages = { en, fr, tr };
const languages = Object.keys(messages);
const localization = {
  languages,
  fallback: languages[0],
  async: Meteor.settings.public.localization.async,
  messages,
};
export default localization;
