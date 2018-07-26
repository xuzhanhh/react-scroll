import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Inner from './inner'
import ScrollBar from './ScrollBar'
import VirtualList from './VirtualList'
// import { Scrollbars } from 'react-custom-scrollbars'
class App extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="App">
        <VirtualList  height={300} width={500}>


        </VirtualList>
        {/* <ScrollBar height="300px" width="500px" className="test"> */}
        {/* <Inner /> */}
        {/* </ScrollBar> */}

        {/* <div style={{marginTop:'50px',width:'500px', height:'300px', overflow:'scroll'}}> */}
        {/* <Scrollbars style={{ width: '500px', height: '300px' }}> */}
        {/* <Inner /> */}
        {/* </Scrollbars> */}

      </div>
    );
  }
}

export default App;
