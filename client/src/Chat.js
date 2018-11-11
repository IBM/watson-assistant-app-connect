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
import './Chat.css';
import { TextInput } from 'carbon-components-react'

function ChatItem(props) {
  let typeClass = 'Chat__Item ';
  switch (props.chat.type) {
    case 0:
      typeClass += 'Chat__Item_Initial';
      break;
    case 1:
      typeClass += 'Chat__Item_User';
      break;
    case 2:
      typeClass += 'Chat__Item_Server';
      break;
    default:
      typeClass += 'Chat__Item_Initial';
  }
  return <div className={typeClass}><p>{props.chat.value}</p></div>;
}

function FetchingChatItem(props) {
  return <div className='Chat__Item Chat__Item_Server Chat__Item_Fetching'><p><span className='Chat__Item_Fetching1'>.</span><span className='Chat__Item_Fetching2'>.</span><span className='Chat__Item_Fetching3'>.</span></p></div>;
}

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {value : ''};
  }

  _updateListItems() {
    this.listItems = this.props.chats.map((chat) => {
      return <ChatItem key={chat.id} chat={chat} />;
    });
    if (this.props.isFetching) {
      this.listItems.push(<FetchingChatItem key='fetch' />);
    }
  }

  _scrollToBottom = () => {
    this.chatEnd.scrollIntoView({ behavior : 'smooth'});
  }

  _onChange = (event) => {
    this.setState({value : event.target.value});
  }

  _handleKeyPress = (e) => {
    if(e.key === 'Enter' && this.state.value !== '') {
      this.props.onChatEntered(this.state.value);
      this.setState({value : ''});
    }
  }

  render() {
    this._updateListItems();
    return (
      <div className="Chat">
        <div className="Chat__ChatRecord">
          {this.listItems}
          <div ref={(el) => { this.chatEnd = el; }}>
          </div>
        </div>
        <TextInput id="botInput" labelText="Bot Input" hideLabel value={this.state.value} onKeyPress={this._handleKeyPress} onChange={this._onChange} placeholder="Type something" />
      </div>
    );
  }

  componentDidMount() {
    this._scrollToBottom();
  }

  componentDidUpdate() {
    this._scrollToBottom();
  }

}

export default Chat;
