import React from 'react';
import Helmet from 'react-helmet';
import { pure } from 'meteor/ssrwpo:ssr';

const Protected = () => (
  <div>
    <Helmet title="Protected" />
    <h2>Protected</h2>
  </div>
);
export default pure(Protected);
