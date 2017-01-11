class Cache {
  constructor() {
    this.routes = {};
  }
  set(url, head, body) {
    this.routes[url] = { head, body };
  }
  has(url) {
    return Boolean(this.routes[url]);
  }
  get(url) {
    return this.routes[url];
  }
}
const cache = new Cache();
export default cache;
