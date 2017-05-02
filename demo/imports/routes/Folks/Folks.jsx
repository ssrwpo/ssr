import React from 'react';
import PropTypes from 'prop-types';
import querystring from 'querystring';
import Helmet from 'react-helmet';
import { pure } from 'meteor/ssrwpo:ssr';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import Folk from './routes/Folk';

const Nav = ({ folks }) => (
  <nav><ul>
    {folks.map(folk => <li key={folk.id}>
      <Link to={`/folks?folkId=${folk.id}`}>{folk.name}</Link>
    </li>)}
  </ul></nav>
);
Nav.propTypes = {
  folks: pt.array.isRequired,
};

const Folks = ({ folks, match, location }) => {
  const query = location && location.search
    ? querystring.parse(location.search.slice(1))
    : null;
  const folk = query && query.folkId
    ? folks.find(item => item.id === query.folkId)
    : null;
  return (
    <div>
      <Helmet><title>Folks</title></Helmet>
      <h2>Folks</h2>
      <Route
        exact path={match.url} render={() => (
          folk
          ? <Folk name={folk.name} />
          : <Nav folks={folks} />
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
export default connect(state => ({ folks: state.Folks }))(pure(Folks));
