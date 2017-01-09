# SSR - Router with SSR for Node & Meteor

:warning: Work in progress :warning:

## Usage
```
npm init
yarn add react reac-dom react-router@nest express helmet react-helmet winston logatim
meteor add ssrwpo:ssr
```

## Roadmap
- [ ] Routing
- [ ] Sitemaps
- [ ] Robots.txt
- [ ] Cache control
- [ ] User agent sniffing as data context
- [ ] Grapher injection as data context
- [ ] Server side only routes
- [ ] LRU cache for user agent, routes & data context
- [ ] [Component caching with Electrode](https://github.com/electrode-io/electrode-react-ssr-caching)
- [X] Isomorphic logger
- [ ] Application cache
- [ ] Service workers

## Links
- [Reactjs - Speed up Server Side Rendering - Sasha Aickin](https://www.youtube.com/watch?v=PnpfGy7q96U)
- [Hastening React SSR with Component Memoization and Templatization](https://www.youtube.com/watch?v=sn-C_DKLKPE)
- [Server-Side Rendering: Live Code Session - Supercharged (with info on cache control)](https://www.youtube.com/watch?v=8LM4p7l9YMY)
- [AppCache](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache#Browser_compatibility)
- [Caching best practices & max-age gotchas](https://jakearchibald.com/2016/caching-best-practices/)
