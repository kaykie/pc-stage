import React from 'react';
import {connect} from 'dva';

class App extends React.Component {

  render() {
    return (
      <div>
        hello world
      </div>
    )
  }
}

App.propTypes = {};

export default connect()(App);
