# SSR - Router with SSR for Node & Meteor

:warning: Work in progress :warning:

## Usage
### Installation
```
npm init
yarn add react reac-dom react-router@next express helmet react-helmet \
  winston logatim receptacle useragent es6-enum redux react-redux
meteor add ssrwpo:ssr
```

### Client side call
```js
import { createRouter, logger } from 'meteor/ssrwpo:ssr';
import { BrowserRouter } from 'react-router';
...
createRouter({
  // Your MainApp as the top component that will get rendered in <div id='react' />
  MainApp,
  // Optionnal: An object containing your application reducers
  appReducers,
  // Optionnal: An array of your redux middleware of choice
  appMiddlewares,
  // Optionnal: An array of your collection names
  appCursorNames,
  // The router used in your client
  BrowserRouter,
})
.then(() => logger.info('Router started'));
```

### Server side call
```js
import { createRouter, logger } from 'meteor/ssrwpo:ssr';
import { ServerRouter, createServerRenderContext } from 'react-router';
...
createRouter({
  // Your MainApp as the top component rendered and injected in the HTML payload
  MainApp,
  // Optionnal: An object containing your application reducers
  appReducers,
  // Optionnal: An object containing the cursors required as data context
  appCursors,
  // Optionnal: A function that returns the content of your robots.txt
  robotsTxt,
  // The server side router from react-router-4
  ServerRouter,
  createServerRenderContext,
});
logger.info('Router started');
```

### Platform detection
For the initial render, your app may require some defaults to ensure that
it will server retina images
The platform detection reducer provides the following platforms:

* `android`: Any tablet or phone with Android using Chrome or the built-in browser.
* `ipad`:  Any Apple iPad.
* `iphone`: Any Apple iPhone.
* `safari`: Any MacOS Safari (not iPhone or iPad).
* `ie`: Any Internet Explorer before Edge.
* `default`: All the other browsers and devices.

## Configuration
### Universal logger
#### Loglevel
In your Meteor's settings under the `ssr` object, use the `loglevel` key for
settings the expected log level. Available values:

* **`debug`** Debugging and performance.
* **`info`** (default) Informations.
* **`warning`** Warnings and deprecation messages.
* **`error`** Errors.

### Recommended Babel configuration
For optimal results, set your `.babelrc` with the following content:
```json
{
  "presets": ["meteor"],
  "plugins": [
    "transform-class-properties",
    "transform-react-remove-prop-types",
    "transform-react-constant-elements",
    "transform-react-inline-elements",
    "transform-inline-environment-variables",
    "transform-dead-code-elimination",
    [
      "module-resolver", {
        "alias": {
          "react": "react/dist/react.min",
          "react-router": "react-router/umd/react-router.min",
          "redux": "redux/dist/redux.min",
          "react-redux": "react-redux/dist/react-redux.min"
        }
      }
    ]
  ]
}
```

## Package development
### Benchmarks
For profiling the most appropriate libraries or function call a benchmark suite
is setup in `benchmarks`. Launch a test using [`babel-node`](https://babeljs.io/docs/usage/cli/#babel-node).

Ex. `babel-node benchmarks/getFromObject.js`

### Debug helpers
The last request and last response received in Express are exposes by this
package as `debugLastRequest` and `debugLastResponse`, respectively. In Meteor's
shell, you can access them via:

```js
import { debugLastRequest, debugLastResponse } from 'meteor/ssrwpo:ssr';
```

### Launching tests
This project uses [Jest](https://facebook.github.io/jest/) and [chai](http://chaijs.com/).

```
# In one-shot mode:
yarn test
# In watch mode:
yarn test -- --watchAll --notify
```

### Linting
The linter is based on [ESlint](http://eslint.org/) configured with [Airbnb styles](https://github.com/airbnb/javascript).

```
yarn lint
```

:warning: All code must be linted before sending any PR. See the [Contributing guide](./CONTRIBUTING.md).

## Roadmap
### v1
* [X] Universal logger
* [X] Client side routing
* [ ] Server side routing
  * [X] Main routing
  * [X] Missed route (404)
  * [X] Redirect route
  * [ ] URL parameters
* [ ] Sitemaps
* [X] Robots.txt
* [X] Cache control (etag, max-age, if-none-match)
* [X] User agent sniffing as data context
* [X] Reactive collections as data context
* [ ] Server side only routes and REST API for webhooks
* [X] Server side LRU cache with TTL for
  * [X] Routes
  * [X] User agent
  * [X] Data context
* [X] Counter measure when Meteor.Reload starts requesting the same URL over & over again

### v2
* [ ] Configurable browser policy
* [ ] Application cache API
* [ ] Service workers
* [ ] i18n support
* [ ] Cache prefilling
* [ ] Server side routing
  * [ ] No SSR routes
* [ ] Component caching with Electrode
* [ ] Server stats
  * [ ] From cache vs rendered
  * [ ] System usage: CPU, RAM
  * [ ] Most rendered page
  * [ ] Longest rendered page

### v3
* [ ] Styled components
* [ ] Above the fold
* [ ] Code splitting

## 3rd party documentation
- [Application router: react-router-4](https://react-router.now.sh)
- [Client side logging: logatim](https://github.com/sospedra/logatim)
- [Server side logging: winston](https://github.com/winstonjs/winston)
- [Protocol: Robots.txt](http://www.robotstxt.org/)
- [Protocol: Sitemaps](https://www.sitemaps.org/)
- [Server side security: helmet](https://github.com/helmetjs/helmet)
- [Server side performance profiling: benchmark](https://benchmarkjs.com/)
- [In memory LRU cache: receptacle](https://github.com/DylanPiercey/receptacle)
- [Server side component caching: electrode-react-ssr-caching](https://github.com/electrode-io/electrode-react-ssr-caching)
- [User agent parser: useragent](https://github.com/3rd-Eden/useragent)
- [Meteor issue on Hot code push](https://github.com/meteor/meteor/issues/7115)
- [Discussions about Hot code push issue](https://forums.meteor.com/t/app-constantly-refreshing-after-an-update/23586/143)
- [Unit tests: Jest](https://facebook.github.io/jest/)
- [Unit tests: chai](http://chaijs.com/)

## Links
- [Reactjs - Speed up Server Side Rendering - Sasha Aickin](https://www.youtube.com/watch?v=PnpfGy7q96U)
- [Hastening React SSR with Component Memoization and Templatization](https://www.youtube.com/watch?v=sn-C_DKLKPE)
- [Server-Side Rendering: Live Code Session - Supercharged (with info on cache control)](https://www.youtube.com/watch?v=8LM4p7l9YMY)
- [AppCache](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache#Browser_compatibility)
- [Caching best practices & max-age gotchas](https://jakearchibald.com/2016/caching-best-practices/)
- [Increasing Application Performance with HTTP Cache Headers](https://devcenter.heroku.com/articles/increasing-application-performance-with-http-cache-headers)
