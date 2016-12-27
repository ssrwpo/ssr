import React, { PropTypes as pt } from 'react';
import Helmet from 'react-helmet';

const MainApp = ({ context }) => (
  <main>
    <Helmet title="Home" />
    <h1>Hello world</h1>
    {context.someItems.map((item, idx) => <p key={idx}>{item}</p>)}
  </main>
);
MainApp.propTypes = {
  context: pt.object.isRequired,
};
export default MainApp;
