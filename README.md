# SSR - Router with SSR for Node & Meteor

Server side rendering with Express, react-router-4 & redux for Meteor.

## Usage
### Installation in your own project

You can replace yarn by your favorite way of installing NPM packages.  
To install yarn : https://yarnpkg.com/en/docs/install  
To install "meteor yarn" : ```meteor npm i -g yarn```  

```
meteor yarn add react react-dom react-router-dom@4.0.0-beta.3 express helmet \
  react-helmet winston logatim receptacle useragent redux react-redux moment \
  react-intl react-intl-redux lodash actual lodash actual url-pattern
meteor add ssrwpo:ssr
```

### To run the demo based on this repository

```
git clone https://github.com/ssr-server/ssr.git && cd ssr
meteor yarn install
cd demo
meteor yarn install
yarn meteor
```

### Client side call
```js
import { createRouter, logger } from 'meteor/ssrwpo:ssr';
...
createRouter({
  // Your MainApp as the top component that will get rendered in <div id='react' />
  MainApp,
  // Optional: Store subscription
  storeSubscription,
  // Optional: An object containing your application reducers
  appReducers,
  // Optional: An array of your collection names
  appCursorNames,
  // Optional: Add a redux store that watches for URL changes
  hasUrlStore: false,
  // Optional: Localization
  localization,
  // Optional: Server uses a platform transformer, client must load optional reducers
  hasPlatformTransformer = true,
})
.then(() => logger.info('Router started'));
```

### Server side call
```js
import { createRouter, logger } from 'meteor/ssrwpo:ssr';
...
createRouter({
  // Your MainApp as the top component rendered and injected in the HTML payload
  MainApp,
  // Optional: Store subscription
  storeSubscription,
  // Optional: An object containing your application reducers
  appReducers,
  // Optional: An object containing the cursors required as data context
  appCursors,
  // Optional: A function that returns the content of your robots.txt
  robotsTxt,
  // Optional: A function that returns the content of your sitemaps.xml
  sitemapXml,
  // Optional: An object with keys on URL with query parameters
  urlQueryParameters,
  // Optional: An object with keys on route solver
  webhooks,
  // Optional: Localization
  localization,
  // Optional: A platform transformer (see hereafter), a default transformer is provided
  platformTransformers,
});
logger.info('Router started');
```

### Server Side Rendering
Server-side rendering uses a Redux store to supply the data that each component needs. The store is
added to the HTML payload and initialised on the client with the same data as that used for the render.

To enable this, the react component tree for any given route is first traversed to allow for each
component to hydrate the store with the data required for rendering. Once this is complete,
the application is rendered using the hydrated store, and the resulting route is cached.

Redux actions are provided to allow the stored to be initialised with Meteor cursors if required, and
synchronisation helpers make it easy to regain Meteor's reactivity by subscribing to publications and pushing changes to the store.

There are 3 ways in which a component can participate in this initialisation process:

#### 1. Using componentWillMount to prepare the store in a synchronised way

Code in `componentWillMount` will be executed on both the client and server.
It's important to understand that on server on will be executed twice - once to prepare
the store, and again during the rendering process. Using a flag in the store to mark
that the initialisation is complete will not only avoid doing the work twice on the
server, but it will also allow us to avoid requesting the data again on the client
(since we know that the store data was sent with the payload).

````
componentWillMount() {
  const {
    isPubSubInitialised,
    markPubSubAsInitialised,
    PubSubStore,
    handleSyncViaMethod,
  } = this.props;

  if (!isPubSubInitialised) {
    handleSyncViaMethod(0, PubSubStore);
    markPubSubAsInitialised();
  }
}
````

#### 2. By providing a synchronous `prepareStore` function to the component's `ssr` requirements

Each component can provide SSR requirements which may include a function which hydrates the store:

````
const prepareGlobalStores = (store) => {
  const { areGlobalStoresInitialised } = store.getState();
  if (!areGlobalStoresInitialised) {
    const globalCollections = [
      { collection: PlacesCollection, name: 'Places' },
      { collection: FolksCollection, name: 'Folks' }];

    globalCollections.forEach(({ collection, name }) => {
      collection.find({}, { sort: { order: -1 } }).fetch().forEach((item) => {
        store.dispatch(collectionAdd(
          name,
          item._id,
          omit(item, '_id'),
        ));
      });
    });

    store.dispatch(valueSet('areGlobalStoresInitialised', true));
  }
};

MainApp.ssr = {
  prepareStore: prepareGlobalStores,
};
````

#### 3. By returning a Promise from the `prepareStore` function

By returning a promise, we ask the server to wait for asynchronous data to become available before
rendering the page. The promise should fetch the data and hydrate the store.

### Localization and react-intl
We use react-intl for server side rendered localization. It gets the user browser language and serves the right language.

You can find more about :
* [react-intl](https://github.com/yahoo/react-intl)  

Do not need it. See [FAQ](https://github.com/ssr-server/ssr/blob/master/FAQ.md) how to remove from [demo](https://github.com/ssr-server/ssr/tree/master/demo) app.

### 404 - Not found route
`react-router` will always render your application. For identifying a `404`, you
have to tell to the server that while rendering the app, one of the displayed
component is due to a `404`. This is achieved via the `react-router`'s `staticContext`
and by setting into it a `has404` boolean used by the server to identify the route
as `404` Not found route.

Example: [NotFound](https://github.com/ssr-server/ssr/blob/master/demo/imports/routes/NotFound.jsx)

## Sever side routes
### Pre-made: Robots.txt and Sitemap.xml

To set up your robots.txt, you need to have a key "robotsTxt" inside the object
that you pass to the server-side createRouter function. This key should contain
a function that returns a string with the desired content of your robots.txt.
The same principle applies to sitemap.xml, with the key "sitemapXml". The function
that you pass will receive store as it's first parameter. This allows you to
programmatically build your sitemap.xml or robots.txt based on the store contents.  

For example, you can populate your sitemap.xml of dynamic routes generated based
on the store data. You can see examples of building these functions here:  
* [Robots.txt](https://github.com/ssr-server/ssr/blob/master/demo/server/robotsTxt.js "Robots.txt builder")  
* [Sitemap.xml](https://github.com/ssr-server/ssr/blob/master/demo/server/sitemapXml.js "Sitemap.xml builder")

For easing the sitemap creation, a convenient tool `sitemapFromArray` accepts an array of object with the following keys:

* `slug`: A mandatory relative URL to a page
* `lastmod`: An optional `Date`
* `changefreq`: An optional frequency of robot's revisiting with the following allowed values: `always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`.
* `priority`: An optional priority when search engine are displaying your map. When none provided, robots are using 0.5. This value range from 0 to 1.

For using it:
```js
// Server side only
import { sitemapFromArray } from 'meteor/ssrwpo:ssr';
...
const sitemapContent = sitemapFromArray([
  // The home
  { slug: '', lastmod: new Date(), priority: 1 },
  // A frequently changed news page
  { slug: 'news', changefreq: 'hourly' },
  // ...
]);
```

### Your own webhooks or REST API
By passing a webhooks object, you can build your own server side routes powered
by Express. A small example is setup in the demo:
[webhooks](https://github.com/ssr-server/ssr/blob/master/demo/server/webhooks.js).

## Reducers
### Platform detection, built-in reducer
For the initial render, your app may require some defaults to ensure that
it will server retina images or specific layout for a platform.

The `platform` detection reducer provides the following platforms:

* `android`: Any tablet or phone with Android using Chrome or the built-in browser.
* `ipad`:  Any Apple iPad.
* `iphone`: Any Apple iPhone.
* `safari`: Any MacOS Safari (not iPhone or iPad).
* `ie`: Any Internet Explorer before Edge.
* `default`: All the other browsers and devices.

By default, a `platformTransformers` is provided and adds 4 built-in reducers to
the app: `retina`, `mobile`, `viewportWidth`, `viewportHeight`. It only applies
to server side rendering. When your client side app is rendered, you can patch
the default values that the server has injected with a bult-in component:

`<BrowserStats retinaMinDpi={<number>} mobileBreakpoint={<number>} debounceTimer={<number>} />`
where :

* `retinaMinDpi`: 144, by default (1.5 x 96 in dpi).
* `mobileBreakpoint`: 992, by default (in px).
* `debounceTimer`: 64, by default (4 x 16 in ms).

If you want to build your own `platformTransformers` and `<BrowserStats />`, please
refer to the following sources for inspiration:

* [`platformTransformers`](https://github.com/ssr-server/ssr/blob/master/server/utils/platformTransformers.js).
* [`<BrowserStats />`](https://github.com/ssr-server/ssr/blob/master/shared/components/BrowserStats.jsx)


### Build date, built-in reducer
Each produced HTML payload is tagged with a build date allowing capabilities
to check if a reload is required. The reducer is named `buildDate` and it
contains a UNIX date.

### Reducer helpers
Store creation (see [Reducer](https://github.com/ssr-server/ssr/blob/master/shared/reducers/utils)):

* Collections store: `createCollectionReducers`
* Value store: `createValueReducer`

Actions on reducers:

* On collection store:
  * `collectionAdd`
  * `collectionChange`
  * `collectionRemove`
* On value store:
  * `valueSet`
  * `valueReset`

### Synchronisation helpers for collections
When your collection is serialized in the store, you may want to synchronize it
when your application starts, or when entering a page, or on a user action ...
As this is a common use case for Meteor, we provide an easy way to create
`mapDispatchToProps` methods for subscribing/subscribing or calling a validated
method that will synchronize your collection store.

Example: [PubSub](https://github.com/ssr-server/ssr/blob/master/demo/imports/routes/PubSub.jsx "PubSub")

#### Via subscribe: `createHandleSubscribe`
The subscribe / unsubscribe based synchronization helper has the following API:
```js
/**
 * `createHandleSubscribe`
 * Create an `handleSubscribe` function for your `mapDispatchToProps`.
 * @param dispatch Store's dispatch.
 * @param publicationName Your publication name which must accept an UNIX date value as `lastMod`.
 * @param cursor A cursor on Mongo collection with a `lastMod` set on each item.
 * @param valueStoreNameForSubscription Name of the value store identifying subscription state.
 * @param collectionStoreName Name of the collection store holding replica of collection.
 * @return A function allowing to subscribe and unsubscribe.
 */
```

#### Via validated method: `createHandleSyncViaMethod`
The validated method based synchronization helper has the following API:
```js
/**
 * `createHandleSyncViaMethod`
 * Create an `handleSyncViaMethod` function for your `mapDispatchToProps`.
 * @param dispatch Store's dispatch.
 * @param validatedMethod A validated method, promised based
 *  (see didericis:callpromise-mixin) that accepts { lastMod } as its params.
 * @param collectionStoreName Name of the collection store holding replica of collection.
 * @return A function allowing to subscribe and unsubscribe.
 */
```

### High Order Components
This package provides some HOC for common cases scenarios all geared torwards
performances.

#### `pure`
Asymetric HOC for transforming a functional component into a `React.PureComponent` on the client and leaving it unmodified on the server.

``` js
import React from 'react';
import { pure } from 'meteor/ssrwpo:ssr';

const MyComponent = (props) => ( ... );
export default pure(MyComponent);
```

Example: [Performance](https://github.com/ssr-server/ssr/blob/master/demo/imports/routes/Performance.jsx)

#### `asymetricSsr`
Same as `pure` apart that it takes one or two component:

* When 2 components are used, the first one is rendered client side only, the
  second server side only. This allows changes of behavior while the app is
  loading, like for displaying a spinner or forbidding access to some functions.
* When one component is used, the server will not render the component
  (the no SSR case) which only shows up on the client when React is started.

```js
import React from 'react';
import { asymetricSsr } from 'meteor/ssrwpo:ssr';
...
const Loading = () => <p>Loading</p>;
const Loaded = () => <p>Loaded</p>;
...
const LoadingStateWithServerDisplay = asymetricSsr(Loaded, Loading);
const LoadingStateWithout = asymetricSsr(Loaded);
...
```

Example: [Asymetric SSR](https://github.com/ssr-server/ssr/blob/master/demo/imports/routes/asymetricSsr.jsx)

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
    "transform-dead-code-elimination"
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
- [Progressive Web Apps With React](https://addyosmani.com/blog/progressive-web-apps-with-react/)
- [Discussion on main thread at client side initial rendering](https://github.com/developit/preact/issues/407)
