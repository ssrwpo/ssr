import { PLATFORM } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const set = platform => ({ type: PLATFORM.SET, value: platform });
