import React from 'react';
import PropTypes from 'prop-types';
import querystring from 'querystring';
import Helmet from 'react-helmet';
import { pure } from 'meteor/ssrwpo:ssr';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import Folk from './routes/Folk';

const Aside = ({ folks }) => (
  <aside><ul>
    {folks.map(folk => <li key={folk.id}>
      <Link to={`/folks/${folk.id}`}>{`Url parameter: ${folk.name}`}</Link>
      <br />
      <Link to={`/folks?folkId=${folk.id}`}>
        {`Query params: ${folk.name}`}
      </Link>
    </li>)}
  </ul></aside>
);
Aside.propTypes = {
  folks: pt.array.isRequired,
};

const Folks = ({ folks, match, location }) => {
  const query = location && location.search
    ? querystring.parse(location.search.slice(1))
    : null;
  const folkId = (query && query.folkId) || match.params.folkId;
  const folk = folkId && folks.find(item => item.id === folkId);
  return (
    <div>
      <Helmet><title>Folks</title></Helmet>
      <h2>Folks</h2>
      <Route
        exact path={match.url} render={() => (
          folk
          ? <Folk name={folk.name} />
          : <Aside folks={folks} />
        )}
      />
    </div>
  );
};

Folks.propTypes = {
  folks: PropTypes.array.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

// state.Folks is the the redux store that was pre-hydrated from the Mongo collection by
// the server. The hydration was performed by `prepareGlobalStores`.
export default connect(state => ({ folks: state.Folks }))(pure(Folks));
