# SSR - Router with SSR for Node & Meteor

:warning: Work in progress :warning:

## Usage
```
npm init
yarn add react reac-dom react-router@nest express helmet react-helmet winston logatim
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

## Roadmap
### v1
- [X] Universal logger
- [X] Client side routing
- [ ] Server side routing
  - [X] Main routing
  - [ ] Missed route (404)
  - [ ] Redirect route
  - [ ] No SSR routes
- [ ] Sitemaps
- [ ] Robots.txt
- [ ] Cache control (Etag, max-age)
- [ ] User agent sniffing as data context
- [ ] Pub/sub collections as data context
- [ ] Server side only routes and REST API for webhooks
- [ ] LRU cache for user agent, routes & data context
- [ ] [Component caching with Electrode](https://github.com/electrode-io/electrode-react-ssr-caching)

### v2
- [ ] Browser policy
- [ ] Application cache API
- [ ] Service workers
- [ ] i18n support

## 3rd party documentation
- [Application router: react-router-4](https://react-router.now.sh)
- [Client side logging: logatim](https://github.com/sospedra/logatim)
- [Server side logging: winston](https://github.com/winstonjs/winston)
- [Protocol: Robots.txt](http://www.robotstxt.org/)
- [Protocol: Sitemaps](https://www.sitemaps.org/)
- [Server side security: Helmet](https://github.com/helmetjs/helmet)

## Links
- [Reactjs - Speed up Server Side Rendering - Sasha Aickin](https://www.youtube.com/watch?v=PnpfGy7q96U)
- [Hastening React SSR with Component Memoization and Templatization](https://www.youtube.com/watch?v=sn-C_DKLKPE)
- [Server-Side Rendering: Live Code Session - Supercharged (with info on cache control)](https://www.youtube.com/watch?v=8LM4p7l9YMY)
- [AppCache](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache#Browser_compatibility)
- [Caching best practices & max-age gotchas](https://jakearchibald.com/2016/caching-best-practices/)
