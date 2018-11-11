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
 
import { ToastNotification } from 'carbon-components-react';
import React from 'react';
import PropTypes from 'prop-types'

import './Toast.css';

const Toast = ({title, subtitle, caption, onCloseButtonClick}) => {
  return ( caption &&
    <ToastNotification title={title} subtitle={subtitle} caption={caption} className='alerts' onCloseButtonClick={onCloseButtonClick} />
  );
};

Toast.propTypes = {
  title : PropTypes.string.isRequired,
  subtitle : PropTypes.string.isRequired,
  caption : PropTypes.string.isRequired,
  onCloseButtonClick : PropTypes.func.isRequired
};

export default Toast;
