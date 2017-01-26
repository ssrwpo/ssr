import { REDIRECT } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const disable = () => ({ type: REDIRECT.DISABLE });

export const to = url => ({ type: REDIRECT.TO, url });
