# 2.5.0 PropTypes as external package

* react 15.5.x deprecates `PropTypes`: user NPM's `prop-types`.
* Meteor 1.4.4.1

# 2.4.0 cordova friendly

* Avoid analyzing cordova's hot code push URL: `/__cordova/`.

# 2.3.0 react-helmet 5.x, sitemap.js & humans.txt

* react-helmet: 5.X API.
* `sitemap.xml` helper has been removed in favor of [sitemap.js](https://github.com/ekalinin/sitemap.js).
* `humans.txt` has been added as available static routes.
* Replace logatim & winston with pino for universal logging,
  remove any logger dependency: `yarn remove logatim winston; yarn add pino`.
* Fasten hash calculations using only content from store & WebApp.clientHash.
* HTML minification: `yarn add html-minifier`.
* In production, set `<script>` as `async` for all external scripts.
