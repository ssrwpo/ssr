import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Folk from './routes/Folk';

const Nav = ({ folks }) => (
  <nav><ul>
    {folks.map(folk => <li key={folk.id}>
      <Link to={{ query: { id: folk.id } }}>{folk.name}</Link>
    </li>)}
  </ul></nav>
);
Nav.propTypes = {
  folks: PropTypes.array.isRequired,
};

const Folks = ({ folks, location }) => {
  const id = location.query && location.query.id;
  const folk = id && folks.find(item => item.id === id);
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
export default connect(state => ({ folks: state.Folks }))(Folks);
