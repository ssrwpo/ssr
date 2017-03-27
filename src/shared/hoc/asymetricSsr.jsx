import { Meteor } from 'meteor/meteor';
/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import React, { PureComponent } from 'react';
/* eslint-enable */

const NoDisplay = () => null;

// eslint-disable-next-line import/no-mutable-exports
let asymetricSsr = (Component, ServerComponent = NoDisplay) =>
  // eslint-disable-next-line react/prefer-stateless-function
  class extends PureComponent {
    constructor(props) {
      super(props);
      this.state = { mounted: false };
    }
    componentDidMount() {
      requestAnimationFrame(() =>
        this.setState({ mounted: true }),
      );
    }
    render() {
      const { mounted } = this.state;
      if (mounted) return <Component {...this.props} />;
      return <ServerComponent {...this.props} />;
    }
  };

if (Meteor.isServer) {
  asymetricSsr = (Component, ServerComponent = NoDisplay) => ServerComponent;
}

export default asymetricSsr;
