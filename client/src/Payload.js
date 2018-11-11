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

import './Payload.css';

import SyntaxHighlighter, { registerLanguage } from "react-syntax-highlighter/light";
import json from 'react-syntax-highlighter/languages/hljs/json';
import { githubGist } from 'react-syntax-highlighter/styles/hljs';

registerLanguage('json', json);

class Payload extends Component {
  render() {
    return (
      <div className="Payload">
        <div className="header">User input</div>
        <div className="bx--snippet--code">
          <SyntaxHighlighter language='javascript' style={githubGist} showLineNumbers>{this.props.userData}</SyntaxHighlighter>
        </div>
        <div className="header">Watson understands</div>
        <div className="bx--snippet--code">
          <SyntaxHighlighter language='javascript' style={githubGist} showLineNumbers>{this.props.watsonData}</SyntaxHighlighter>
        </div>
      </div>
    );
  }
}

export default Payload;
