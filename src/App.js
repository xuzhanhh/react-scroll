import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Inner from './inner'
import ScrollBar from './ScrollBar'
import { Scrollbars } from 'react-custom-scrollbars'
class App extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="App">
        {/* <div className="wrapper"> */}
          <ScrollBar height="500px" width="500px">
          {/* <Scrollbars style={{width:'500px', height:'300px'}}> */}
            <Inner />
            {/* </Scrollbars> */}
          </ScrollBar>
        {/* </div> */}
      </div>
    );
  }
}

export default App;
