import { valueSet } from '../../shared/actions/utils';

const platformTransformers = (dispatch, platform) => {
  let config;
  switch (platform) {
    case 'android':
      config = {
        viewportWidth: 360,
        viewportHeight: 640,
        retina: true,
        mobile: true,
      };
      break;
    case 'ipad':
      config = {
        viewportWidth: 1024,
        viewportHeight: 768,
        retina: true,
        mobile: false,
      };
      break;
    case 'iphone':
      config = {
        viewportWidth: 375,
        viewportHeight: 667,
        retina: true,
        mobile: true,
      };
      break;
    case 'safari':
    case 'ie':
    default:
      config = {
        viewportWidth: 1366,
        viewportHeight: 768,
        retina: false,
        mobile: false,
      };
      break;
  }
  Object.keys(config).forEach(confName =>
    dispatch(valueSet(confName, config[confName])),
  );
};

export default platformTransformers;
