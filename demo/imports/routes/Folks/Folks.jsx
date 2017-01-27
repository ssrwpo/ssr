import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { pure } from 'meteor/ssrwpo:ssr';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Folk from './routes/Folk';

const Nav = ({ folks }) => (
  <nav><ul>
    {folks.map(folk => <li key={folk.id}>
      <Link to={{ query: { folkId: folk.id } }}>{folk.name}</Link>
    </li>)}
  </ul></nav>
);
Nav.propTypes = {
  folks: PropTypes.array.isRequired,
};

const Folks = ({ folks, location }) => {
  const folkId = location.query && location.query.folkId;
  const folk = folkId && folks.find(item => item.id === folkId);
  return (
    <div>
      <Helmet title="Folks" />
      <h2>Folks</h2>
      {
        folk
        ? <Folk name={folk.name} />
        : <Nav folks={folks} />
      }
    </div>
  );
};
Folks.propTypes = {
  folks: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
};
export default connect(state => ({ folks: state.Folks }))(pure(Folks));
