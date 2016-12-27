import React, { PureComponent } from 'react';
import { BrowserRouter, Match, Miss, Link } from 'react-router';
import Helmet from 'react-helmet';
import { EJSON } from 'meteor/ejson';

class MainApp extends PureComponent {
  render() {
    const { context } = this.props;
    return (
      <main>
        <Helmet title="Home" />
        <h1>Hello world</h1>
        {context.someItems.map((item, idx) => <p key={idx}>{item}</p>)}
      </main>
    );
  }
}

export default MainApp;
