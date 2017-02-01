import React from 'react';
import Helmet from 'react-helmet';
import { pure, asymetricSsr } from 'meteor/ssrwpo:ssr';

const Loading = () => <p>Loading</p>;
const Loaded = () => <p>Loaded</p>;

const LoadingStateWithServerDisplay = asymetricSsr(Loaded, Loading);
const LoadingStateWithout = asymetricSsr(Loaded);

const AsymetricSsr = () => (
  <div>
    <Helmet title="Asymetric SSR & No SSR" />
    <h2>Asymetric SSR & No SSR</h2>
    <hr />
    <p>A component rendering differently on the server and the client</p>
    <LoadingStateWithServerDisplay />
    <hr />
    <p>A component only rendered on client (No SSR case)</p>
    <LoadingStateWithout />
  </div>
);
export default pure(AsymetricSsr);
