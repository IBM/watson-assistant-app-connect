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
 
import { CHAT_TYPE_INITIAL, CHAT_TYPE_USER, CHAT_TYPE_SERVER,
  CHAT_ENTERED, REQUEST_WATSON, RECEIVE_WATSON, UPDATE_CONTEXT,
  DISPLAY_USER, DISPLAY_WATSON, RECEIVE_WATSON_ERROR, DISMISS_WATSON_ERROR,
  UPDATE_SELECTED_PAYLOAD, SELECT_LAST_PAYLOAD
 } from './actions.js';

import { combineReducers } from 'redux';

const uuidv1 = require('uuid/v1');

function chats(state = {items : [{value: 'Welcome to Chat bot!', type: CHAT_TYPE_INITIAL, id: 0}], isFetching : false, fetchError : null}, action) {
  switch (action.type) {
    case CHAT_ENTERED:
      return { items : [
        ...state.items,
        {
          value : action.text, type : CHAT_TYPE_USER, id: uuidv1()
        }
      ], isFetching : state.isFetching, fetchError : state.fetchError };
    case REQUEST_WATSON :
      return { items : [...state.items], isFetching : true, fetchError : null };
    case RECEIVE_WATSON :
      return { items : [
        ...state.items,
        {
          value : action.text, type : CHAT_TYPE_SERVER, id: uuidv1()
        }
      ], isFetching : false, fetchError : null };
    case RECEIVE_WATSON_ERROR :
      return { items : [...state.items], isFetching : false, fetchError : action.error };
    case DISMISS_WATSON_ERROR :
      return { items : [...state.items], isFetching : state.isFetching, fetchError : null };
    default:
      return state;
  }
}

function payloads(state = {selected : 0, user : [], watson : []}, action) {
  switch(action.type) {
    case DISPLAY_USER:
      return {selected : state.selected, user : [...state.user, action.payload], watson : [...state.watson]};
    case DISPLAY_WATSON:
      return {selected : state.selected, user : [...state.user], watson : [...state.watson, action.payload]};
    case UPDATE_SELECTED_PAYLOAD:
      return {selected : action.id, user : [...state.user], watson : [...state.watson]};
    case SELECT_LAST_PAYLOAD:
      return {selected : state.watson.length - 1, user : [...state.user], watson : [...state.watson]};
    default:
      return state;
  }
}

// update context with the provided action.context
function context(state = {}, action) {
  switch(action.type) {
    case UPDATE_CONTEXT:
      return action.context || {};
    default:
      return state;
  }
}

var chatApp = combineReducers({
  chats,
  payloads,
  context
});

export default chatApp;
