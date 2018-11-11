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
import { Dropdown, DropdownItem } from 'carbon-components-react'

import './PayloadSelector.css';

class PayloadSelector extends Component {
  _updateListItems() {
    this.listItems = this.props.options.map((option, i) => {
      return <DropdownItem key={"key" + i} itemText={i.toString()} value={i.toString()} />;
    });
  }

  _onChange = (event) => {
    this.props.onPayloadSelected(event.value);
  }

  render() {
    this._updateListItems();
    return (
      <div className="PayloadSelector">
        <div className="header">Select payload to view</div>
        <Dropdown onChange={this._onChange} ariaLabel="" selectedText={this.props.selected.toString()}>
          {this.listItems}
        </Dropdown>
      </div>
    );
  }

}

export default PayloadSelector;
