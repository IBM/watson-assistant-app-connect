/**
 * Copyright (c) 2018 David Seager
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
import React, { Component } from 'react';
import { connect } from 'react-redux';

import './App.css';
import PayloadContainer from './PayloadContainer';
import PayloadSelectorContainer from './PayloadSelectorContainer';
import 'carbon-components/css/carbon-components.css';
import ChatContainer from './ChatContainer';
import ToastContainer from './ToastContainer';
import { fetchWatson } from './actions';

class App extends Component {
  render() {
    return (
      <div className="responsive-columns-wrapper">
        <div><ToastContainer></ToastContainer></div>
        <div className="column-holder">
          <div className="chat-column">
            <ChatContainer></ChatContainer>
          </div>
        </div>
        <div className="column-holder">
          <PayloadSelectorContainer></PayloadSelectorContainer>
          <PayloadContainer></PayloadContainer>
        </div>
      </div>
    );
  }

  componentDidMount() {
    // immediately send a request to Assistant
    this.props.sendWatson();
  }
}

const mapStateToProps = state => {
  return {
  }
};

const mapDispatchToProps = dispatch => {
  return {
    sendWatson: () => {
      dispatch(fetchWatson(""));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
