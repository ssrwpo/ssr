import { Meteor } from 'meteor/meteor';
/* eslint-disable no-undef, import/no-extraneous-dependencies, import/no-unresolved, import/extensions, max-len */
import React, { PureComponent } from 'react';
/* eslint-enable */

// eslint-disable-next-line import/no-mutable-exports
let pure = Component => Component;

if (Meteor.isClient) {
  pure = Component =>
    // eslint-disable-next-line react/prefer-stateless-function
    class extends PureComponent {
      render() {
        return (<Component {...this.props} />);
      }
    };
}
export default pure;
