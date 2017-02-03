# Frequently Asked Questions
## Using `pure` and `connect`
First encapsulate your functionnal component, then connect it to the redux store:

```js
import { connect } from 'react-redux';
import { pure } from 'meteor/ssrwpo:ssr';
...
const MyPureConnectedComponent = connect(
  mapStateToProps, mapDispatchToProps,
)(pure(MyComponent));
```

## Removing Localization
1. Delete messages folder inside [demo/imports](https://github.com/ssr-server/ssr/tree/master/demo/imports)
2. Remove these lines from [demo/client/main.js](https://github.com/ssr-server/ssr/blob/master/demo/client/main.js)
```js
...
import { en, fr, tr } from '/imports/messages';
...
const localization = {
  languages: ['en', 'tr', 'fr'], // required
  fallback: 'en', // required
  // language: 'fr', // force default language optional
  messages: { en, fr, tr }, // language resources required
};
...
  // Optional: localization
  localization,
...
```
3. Remove these lines from [demo/server/main.js](https://github.com/ssr-server/ssr/blob/master/demo/server/main.js)
```js
...
import { en, fr, tr } from '/imports/messages';
...
const localization = {
  languages: ['en', 'tr', 'fr'], // required
  fallback: 'en', // required
  // language: 'fr', // force default language optional
  messages: { en, fr, tr }, // language resources required
};
...
  // Optional: localization
  localization,
...
```
4. Delete [demo/imports/routes/Translations.jsx](https://github.com/ssr-server/ssr/tree/master/demo/imports/routes/Translations.jsx).
5. Remove these lines from [demo/imports/app/MainApp.jsx](https://github.com/ssr-server/ssr/blob/master/demo/imports/app/MainApp.jsx)
```js
...
import Translations from '/imports/routes/Translations';
...
...
  <li><Link to="/translations">Translations</Link></li>
...
...
  <Route exact path="/translations" component={Translations} />
...
```
