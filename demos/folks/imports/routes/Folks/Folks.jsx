import React, { PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Folk from './routes/Folk';

const Nav = ({ folks }) => (
  <nav><ul>
    {folks.map(folk => <li key={folk.id}>
      <Link to={`/folks/${folk.id}`}>{`Url parameter: ${folk.name}`}</Link>
      <br />
      <Link to={{ query: { folkId: folk.id } }}>
        {`Query params: ${folk.name}`}
      </Link>
    </li>)}
  </ul></nav>
);
Nav.propTypes = {
  folks: PropTypes.array.isRequired,
};

const Folks = ({ folks, location, params }) => {
  const folkId = (location.query && location.query.folkId) || params.folkId;
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
  params: PropTypes.object.isRequired,
};
export default connect(state => ({ folks: state.Folks }))(Folks);
