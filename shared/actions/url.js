import { URL } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const set = url => ({ type: URL.SET, value: url });
