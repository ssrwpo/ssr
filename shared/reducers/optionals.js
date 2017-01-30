import { createValueReducer } from '../../shared/reducers/utils';

const retina = createValueReducer('retina', false);
const mobile = createValueReducer('mobile', false);
const viewportWidth = createValueReducer('viewportWidth', 0);
const viewportHeight = createValueReducer('viewportHeight', 0);

export {
  retina,
  mobile,
  viewportWidth,
  viewportHeight,
};
