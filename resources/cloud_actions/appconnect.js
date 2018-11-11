function main(params) {
    const rp = require('request-promise');

    let id = params.id;
    // https://service.eu.apiconnect.ibmcloud.com/gws/apigateway/api/ca7abf0d8124dc18c0b8cc4f57f20307d3326ae5543d8f71f2ed63c09a14804d/ZJ1eYw/Customer/
    let options = {
      url : `https://service.eu.apiconnect.ibmcloud.com/gws/apigateway/api/ca7abf0d8124dc18c0b8cc4f57f20307d3326ae5543d8f71f2ed63c09a14804d/ZJ1eYw/Customer/${id}`,
      strictSSL : false,
      headers : {
          'x-ibm-client-id' : params.apiKey,
          'Accept': 'application/json'
      },
      json : true
    };

    return Promise.resolve(rp(options));
}
