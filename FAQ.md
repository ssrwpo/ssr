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

## Removing i18n
1. Delete i18n folder inside [demo/imports](https://github.com/ssr-server/ssr/tree/master/demo/imports)
2. Remove these lines from [demo/client/main.js](https://github.com/ssr-server/ssr/blob/master/demo/client/main.js)
```js
...
// i18n
import i18n from '/imports/i18n/i18nClient';
...
...
  // Optional: An i18n config for client side
  i18n,
...
```
3. Remove these lines from [demo/server/main.js](https://github.com/ssr-server/ssr/blob/master/demo/server/main.js)
```js
...
// i18n
import i18n from '/imports/i18n/i18nServer';
...
...
  // Optional: An i18n config for server side
  i18n,
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
