# SSR - Router with SSR for Node & Meteor

:warning: Work in progress :warning:

## Usage
```
npm init
yarn add react reac-dom react-router@next express helmet react-helmet \
  winston logatim receptacle useragent
meteor add ssrwpo:ssr
```

## Configuration
### Universal logger
#### Loglevel
In your Meteor's settings under the `ssr` object, use the `loglevel` key for
settings the expected log level. Available values:

* **`debug`** Debugging and performance.
* **`info`** (default) Informations.
* **`warning`** Warnings and deprecation messages.
* **`error`** Errors.

## Benchmarks
For profiling the most appropriate libraries or function call a benchmark suite
is setup in `benchmarks`. Launch a test using [`babel-node`](https://babeljs.io/docs/usage/cli/#babel-node).

Ex. `babel-node benchmarks/getFromObject.js`

## Debug helpers
The last request and last response received in Express are exposes by this
package as `debugLastRequest` and `debugLastResponse`, respectively. In Meteor's
shell, you can access them via:

```js
import { debugLastRequest, debugLastResponse } from 'meteor/ssrwpo:ssr';
```

## Roadmap
### v1
* [X] Universal logger
* [X] Client side routing
* [ ] Server side routing
  * [X] Main routing
  * [ ] Missed route (404)
  * [X] Redirect route
* [ ] Sitemaps
* [ ] Robots.txt
* [ ] Cache control (Etag, max-age)
* [ ] User agent sniffing as data context
* [ ] Pub/sub collections as data context
* [ ] Server side only routes and REST API for webhooks
* [ ] Server side LRU cache with TTL for
  * [X] Routes
  * [ ] User agent
  * [ ] Data context
* [ ] Component caching with Electrode

### v2
* [ ] Browser policy
* [ ] Application cache API
* [ ] Service workers
* [ ] i18n support
* [ ] Cache prefilling
* [ ] Server side routing
  * [ ] No SSR routes


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
- [Server side component cachine: electrode-react-ssr-cachin](https://github.com/electrode-io/electrode-react-ssr-caching)
- [User agent parser: useragent](https://github.com/3rd-Eden/useragent)

## Links
- [Reactjs - Speed up Server Side Rendering - Sasha Aickin](https://www.youtube.com/watch?v=PnpfGy7q96U)
- [Hastening React SSR with Component Memoization and Templatization](https://www.youtube.com/watch?v=sn-C_DKLKPE)
- [Server-Side Rendering: Live Code Session - Supercharged (with info on cache control)](https://www.youtube.com/watch?v=8LM4p7l9YMY)
- [AppCache](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache#Browser_compatibility)
- [Caching best practices & max-age gotchas](https://jakearchibald.com/2016/caching-best-practices/)
