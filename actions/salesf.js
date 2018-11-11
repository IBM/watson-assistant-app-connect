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
 
'use strict';

const axios = require('axios');

let salesfEndpoint = process.env.SALESF_ENDPOINT || null;
let salesfAPIKey = process.env.SALESF_APIKEY || null;


// call salesf action, call done with (error, result data)
function callSalesf(salesfAction, callback) {
  let id = salesfAction.parameters.id;
  let errors = '';
  if (!salesfEndpoint) {
    errors += 'Salesf endpoint not set, set environment variable SALESF_ENDPOINT to the URL from the API. ';
  }
  if (!salesfAPIKey) {
    errors += 'Salesf API key not set, set environment variable SALESF_APIKEY to the API key of the API.';
  }
  if (errors) {
    return callback(errors);
  }

  return getCustomerData(id, callback);
}

function getCustomerData(id, callback) {
  let endpoint = `${salesfEndpoint}/${id}`;
  console.log(`Salesf fetching ${endpoint}`);
  let headers = {
    'x-ibm-client-id' : salesfAPIKey,
    'Accept' : 'application/json'
  };
  axios.get(endpoint, { headers : headers })
    .then((response) => {
      console.log('Salesf replied with');
      console.dir(response);
      let salesfOutput = response.data;
      callback(null, salesfOutput);
    })
    .catch((error) => {
      console.log('Salesf returned an error');
      console.dir(error);
      callback(JSON.stringify(error.response.data));
    });
}

module.exports = {
  action: callSalesf
}
