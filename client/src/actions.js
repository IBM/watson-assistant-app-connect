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
 
import axios from 'axios';

export const CHAT_ENTERED = 'chatEntered';
export const REQUEST_WATSON = 'requestWatson';
export const RECEIVE_WATSON = 'receiveWatson';
export const RECEIVE_WATSON_ERROR = 'receiveWatsonError';
export const DISMISS_WATSON_ERROR = 'dismissWatsonError';
export const DISPLAY_USER = 'displayUser';
export const DISPLAY_WATSON = 'displayWatson';
export const UPDATE_CONTEXT = 'updateContext';
export const UPDATE_SELECTED_PAYLOAD = 'updateSelectedPayload';
export const SELECT_LAST_PAYLOAD = 'selectLastPayload';

export const CHAT_TYPE_INITIAL = 0;
export const CHAT_TYPE_USER = 1;
export const CHAT_TYPE_SERVER = 2;

// user entered some text
export function chatEntered(text) {
  return {
    type : CHAT_ENTERED,
    text : text
  }
}

// indicate request to Watson
export function requestWatson() {
  return {
    type : REQUEST_WATSON
  }
}

// receive response from Watson
export function receiveWatson(text) {
  return {
    type : RECEIVE_WATSON,
    text : text
  }
}

// receive error response from Watson
export function receiveWatsonError(error) {
  return {
    type : RECEIVE_WATSON_ERROR,
    error : error
  }
}

// dismiss error response from Watson
export function dismissWatsonError() {
  return {
    type : DISMISS_WATSON_ERROR
  }
}

// display the user request to Watson as json
export function displayUser(request) {
  return {
    type : DISPLAY_USER,
    payload : request
  }
}

// display the Watson response as json
export function displayWatson(response) {
  return {
    type : DISPLAY_WATSON,
    payload : response
  }
}

// update the context
export function updateContext(context) {
  return {
    type : UPDATE_CONTEXT,
    context : context
  }
}

// update the selected payload
export function updateSelectedPayload(id) {
  return {
    type : UPDATE_SELECTED_PAYLOAD,
    id : id
  }
}

export function selectLastPayload() {
  return {
    type : SELECT_LAST_PAYLOAD
  }
}

// Thunk to fetch Watson response
export function fetchWatson(text) {
  return function(dispatch, getState) {
    dispatch(requestWatson());

    let context = getState().context;
    let requestData = {
      context : context,
      input : {
        text : text
      }
    };
    dispatch(displayUser(requestData));

    return axios.post('/api/message', requestData).then((response) => {
      if(response.data.output.error) {
        console.error(response.data.output.error);
        dispatch(receiveWatsonError(response.data.output.error));
      } else {
        let text = null;
        if (Array.isArray(response.data.output.text)) {
          text = response.data.output.text.join(' ');
        } else {
          text = response.data.output.text;
        }
        dispatch(receiveWatson(text));
      }
      dispatch(updateContext(response.data.context));
      if(response.data.actionPayloads) {
        dispatch(displayWatson(response.data.actionPayloads.watsonInitial));
        dispatch(displayUser(response.data.actionPayloads.userActionResultPayload));
        delete response.data.actionPayloads;
      }
      dispatch(displayWatson(response.data));
      dispatch(selectLastPayload());
    }).catch((error) => {
      console.error(error);
      // display in a Toast Notification, also stop the progress loader by dispatching receiveError (new)
      dispatch(receiveWatsonError(error));
    });

  };
}
