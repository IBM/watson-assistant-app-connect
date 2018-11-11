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
 
import { connect } from 'react-redux';
import Chat from './Chat';

import { chatEntered, fetchWatson } from './actions';

const mapStateToProps = state => {
  return {
    chats: state.chats.items,
    isFetching : state.chats.isFetching
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onChatEntered: chatText => {
      dispatch(chatEntered(chatText));
      dispatch(fetchWatson(chatText));
    }
  }
};

const ChatContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat);

export default ChatContainer;
