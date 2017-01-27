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

## Programmatic transitions
`react-router` uses a context named `router` to propagate its methods in your components:

* `blockTransitions`
* `createHref`
* `replaceWith`
* `transitionTo`

```js
import React, { PropTypes as pt } from 'react';

const Button = (_, { router }) => {
  const { transitionTo } = router;
  return (
    <button onClick={() => transitionTo('/topics')}>Go to Topics</button>
  );
};
Button.contextTypes = {
  router: pt.object.isRequired,
};
```

## Listening to route transitions
When doing analytics, you need to listen to every route transition. This capability
is provided by `LocationSubscriber` from `react-router`

```js
import { LocationSubscriber } from 'react-router/Broadcasts';
...
<LocationSubscriber>
  {
    (location) => {
      logger.info('location', location);
      return null;
    }
  }
</LocationSubscriber>
```
