import useragent from 'useragent';
import { combineReducers, createStore } from 'redux';
import userAgentAnalysis from '../../../src/server/steps/userAgentAnalysis';
import * as packageReducers from '../../../src/shared/reducers';

const testUserAgents = {
  Chrome: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36',
  Safari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/602.3.12 (KHTML, like Gecko) Version/10.0.2 Safari/602.3.12',
};
Object.keys(testUserAgents).forEach(navigator =>
  it(`analyses ${navigator}`, () => {
    const ua = useragent.lookup(testUserAgents[navigator]);
    expect(ua.family).to.equal(navigator);
  }),
);

const testPlatform = {
  android: 'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Mobile Safari/537.36',
  ipad: 'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
  iphone: 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
  safari: testUserAgents.Safari,
  ie: 'Mozilla/5.0 (Windows NT 6.3; Win64, x64; Trident/7.0; rv:11.0) like Gecko',
  default: testUserAgents.Chrome,
};
const store = createStore(combineReducers(packageReducers));
Object.keys(testPlatform).forEach(platform =>
  it(`analyses platform ${platform}`, () => {
    const stepResults = {
      req: { headers: { 'user-agent': testPlatform[platform] } },
      store,
    };
    userAgentAnalysis(stepResults);
    expect(store.getState().platform).to.equal(platform);
  }),
);
