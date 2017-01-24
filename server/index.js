import { createRouter, debugLastRequest, debugLastResponse } from './createRouter';
import logger from './utils/logger';
import sitemapFromArray from './utils/sitemaps';

// Server side exports
export {
  createRouter,
  logger,
  sitemapFromArray,
  // For easing debug in `meteor shell`
  debugLastRequest, debugLastResponse,
};
