const useragent = require('useragent');

const testUserAgents = {
  Chrome: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36',
  Safari: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/602.3.12 (KHTML, like Gecko) Version/10.0.2 Safari/602.3.12',
};

Object.keys(testUserAgents).forEach((navigator) => {
  it(`analyses ${navigator}`, () => {
    const ua = useragent.lookup(testUserAgents[navigator]);
    expect(ua.family).to.equal(navigator);
  });
});
