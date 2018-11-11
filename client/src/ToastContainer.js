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
import Toast from './Toast';
import { dismissWatsonError } from './actions';

const mapStateToProps = state => {
  let caption = '';
  if (state.chats.fetchError && state.chats.fetchError.response && state.chats.fetchError.response.data) {
    caption = state.chats.fetchError.response.data.error ? state.chats.fetchError.response.data.error : state.chats.fetchError.response.data.toString();
  } else if (state.chats.fetchError) {
    caption = state.chats.fetchError.toString();
  }
  return {
    title : 'Error',
    subtitle : 'Server error',
    caption : caption
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onCloseButtonClick: () => {
      dispatch(dismissWatsonError());
    }
  }
};

const ToastContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Toast);

export default ToastContainer;
