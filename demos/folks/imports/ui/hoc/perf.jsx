import React, { PureComponent } from 'react';
import Perf from 'react-addons-perf';

if (typeof window !== 'undefined') {
  window.Perf = Perf;
}

const perf = Component =>
  class extends PureComponent {
    componentDidMount() {
      setTimeout(Perf.start, 0);
    }
    componentDidUpdate() {
      setTimeout(() => {
        Perf.stop();
        const measures = Perf.getLastMeasurements();
        Perf.printWasted(measures);
        Perf.printOperations(measures);
      }, 0);
    }
    render() {
      return <Component {...this.props} />;
    }
  };

export default perf;
