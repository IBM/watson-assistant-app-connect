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

let weatherCompanyEndpoint = null;
if (process.env.VCAP_SERVICES) {
  const vcap = JSON.parse(process.env.VCAP_SERVICES);
  if (vcap.weatherinsights) {
    weatherCompanyEndpoint = vcap.weatherinsights[0].credentials.url;
  }
} else {
  weatherCompanyEndpoint = process.env.WEATHER_ENDPOINT || null;
}


// call weather action, call done with (error, result data)
function callWeather(weatherAction, callback) {
  let city = weatherAction.parameters.city;
  if (weatherCompanyEndpoint) {
    let location = getLocationCoordinatesForCity(city);
    if(location) {
      return getWeatherForecastForLocation(location, callback);
    } else {
      return callback(`Unknown city: ${city}.`);
    }
  } else {
    return callback('Weather Company endpoint not set, bind the Weather Company service to the app or set environment variable WEATHER_ENDPOINT to the URL from the Weather Company service credentials.');
  }
}

function getLocationCoordinatesForCity(city) {
  var location = {};
  if (city === 'Cairo') {
      location.latitude = '30.0444';
      location.longitude = '31.2357';
  } else if (city === 'NYC') {
      location.latitude = '40.7128';
      location.longitude = '74.0059';
  }
  return location;
}

function getWeatherForecastForLocation(location, callback) {
  const url = `${weatherCompanyEndpoint}/api/weather/v1/geocode/${location.latitude}/${location.longitude}/forecast/daily/3day.json`;
  console.log(`Weather fetching ${url}`);
  axios.get(url)
    .then((response) => {
      console.log('Weather replied with');
      console.dir(response);
      let weatherOutput = response.data.forecasts[1].narrative;
      callback(null, weatherOutput);
    })
    .catch((error) => {
      console.log('Weather returned an error');
      console.dir(error);
      callback(error);
    });
}

module.exports = {
  action: callWeather
}
