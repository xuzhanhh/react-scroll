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
        <ScrollBar height="300px" width="500px">
          <Inner />
        </ScrollBar>

        {/* <div style={{marginTop:'50px'}}>
          <Scrollbars style={{ width: '500px', height: '300px' }}>
            <Inner />
          </Scrollbars>

        </div> */}
      </div>
    );
  }
}

export default App;
