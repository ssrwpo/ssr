# Roadmap
## v1
* [X] Universal logger
* [X] Client side routing
* [X] Server side routing
  * [X] Main routing
  * [X] Missed route (404)
  * [X] Redirect route
  * [X] URL query parameters
* [X] Sitemaps
* [X] Robots.txt
* [X] Cache control (etag, max-age, if-none-match)
* [X] User agent sniffing as data context
* [X] Reactive collections as data context
* [X] Server side only routes and REST API for webhooks
* [X] Server side LRU cache with TTL for
  * [X] Routes
  * [X] User agent
  * [X] Data context
* [X] Counter measure when Meteor.Reload starts requesting the same URL over & over again

## v2
* [X] React router 4: alpha to beta: API changes

## v3
* [ ] Configurable browser policy
* [ ] Application cache API
* [ ] Service workers
* [X] i18n support
* [ ] Cache prefilling
* [ ] API for cache limit control
* [ ] Server side routing
  * [ ] No SSR routes
* [X] Component caching with Electrode
* [ ] Server stats
  * [ ] From cache vs rendered
  * [ ] System usage: CPU, RAM
  * [ ] Most rendered page
  * [ ] Longest rendered page
* [ ] Streaming HTML payload
  * [ ] Reconstruct HTML payload with async links via WebApp.clientPrograms['web.browser']
  * [ ] Add streaming capability to Express with [express-stream](https://github.com/jpodwys/express-stream)

## v4
* [ ] Styled components
* [ ] Above the fold
* [ ] Code splitting
