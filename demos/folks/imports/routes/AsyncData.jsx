import React, { PureComponent, PropTypes as pt } from 'react';
import fetch from 'isomorphic-fetch';
import { logger, valueSet } from 'meteor/ssrwpo:ssr';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { receiveStories } from '/imports/actions';

// This function will be called by the server to prepare the store before the
// server-side rendering.

const prepareStoriesStore = () => {
  logger.debug('Fetching stories...');
  return fetch('//offline-news-api.herokuapp.com/stories')
  .then((response) => {
    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }
    logger.debug('Hydrating store with received stories...');
    return response.json();
  });
};

class AsyncData extends PureComponent {
  static propTypes = {
    isStoryDataInitialised: pt.bool.isRequired,
    stories: pt.array.isRequired,
    setStories: pt.func.isRequired,
  }

  componentWillMount() {
    // If the data isn't already available (we've come here from another route),
    // then we need to initialise the store.
    const { isStoryDataInitialised, setStories } = this.props;
    if (!isStoryDataInitialised) {
      prepareStoriesStore().then((stories) => {
        setStories(stories);
        valueSet('isStoryDataInitialised', true);
      });
    }
  }

  // SSR requirements for this component
  ssr = {
    // If you supply a `prepareStore` function then it will be called to hydrate the store
    // for server-side-rendering. This pre-hydrated store will also be sent with the initial
    // HTML payload.
    //
    // The function may return a promise, in which case the server will wait for it to
    // complete before continuing with the render.
    //
    // In this example we prepare the stories store. Note however that this doesn't mean that
    // the data will necessarily be available on the client. The store will only be pre-hydrated
    // if this component has been rendered on the server. If the client visits this route after
    // the app has been loaded then we'll need to fetch the data when the component mounts.
    // We use a store variable to keep track of this initialised state.
    prepareStore: (store, props, context) => {
      const { isStoryDataInitialised } = store.getState();
      if (!isStoryDataInitialised) {
        return prepareStoriesStore().then((stories) => {
          store.dispatch(receiveStories(stories));
          valueSet('isStoryDataInitialised', true);
        });
      }

      return null;
    },
  };

  render() {
    const { stories } = this.props;
    return (
      <div>
        <Helmet title="Asynchronous data" />
        <h2>Asynchronous data</h2>
        <p>This data display here is fetched asynchronously from http://offline-news-api.herokuapp.com/stories.</p>
        <p>When accessing this route directly on the server, the server will wait
          for the data to be fetched asynchronously into the redux store so that
          it can be rendered on the server and delivered in the HTML payload.</p>
        <p>When accessing a different route the data isn&apos;t included in the payload.
           In this case the data is fetched asynchronously into the store when the component
           is first mounted.</p>
        <hr />
        <ul>
          { stories.map(story => <li key={story.guid}>{story.title}</li>) }
        </ul>
      </div>
    );
  }
}

export default connect(
  state => ({
    isStoryDataInitialised: state.isStoryDataInitialised,
    stories: state.stories.items,
  }),
  dispatch => ({
    setStories: (stories) => { dispatch(receiveStories(stories)); },
  }),
)(AsyncData);
