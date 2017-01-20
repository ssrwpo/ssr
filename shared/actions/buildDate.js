import { BUILD_DATE } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const set = date => ({ type: BUILD_DATE.SET, value: date });
