# Watson Assistant and App Connect integration sample

This is a sample Watson Assistant bot which demonstrates how to call App Connect as an external service. The sample uses both Cloud Functions and client actions to achieve calling App Connect. Cloud Functions are server-less functions. Client actions use the application that hosts the bot UI to call to App Connect.

The sample App Connect API flow exposes an API which looks up customer details from an instance on www.salesforce.com. The sample Watson Assistant bot allows the user to ask for customer details and provide the ID of the customer. The bot then calls the App Connect flow and returns the resulting email address to the user. The sample NodeJS and React application provides a bot web user interface which the user interacts with to chat to the bot, and displays debugging information for developers to understand the message flows to and from Watson Assistant.

# Setup

1. The prereq software is NodeJS v8 and npm v5. Download and install these from https://nodejs.org/.

2. Note you can call a cloud function from a Watson Assistant service in US South or Germany only. Watson Assistant uses the cloud function that is hosted in the same location only.

   If you do not have a Watson Assistant service, you can provision one using the free Lite plan.  Watson Assistant in the IBM Cloud Catalog: https://console.bluemix.net/catalog/services/watson-assistant-formerly-conversation

3. Download this repository. You can clone the repository to your local file system using the git command `git clone` as described on the GitHub page. Alternatively you can download a ZIP of the repository as described on the GitHub page and then extract the ZIP to your file system. All console commands should be run from the root directory of the repository.

4. Import the provided skill (workspace) JSON file in `resources/workspaces` into Assistant. 

   Note: In Assistant, **skill** is the new term for a workspace.

   For details of how to import a skill from a JSON file, see https://console.bluemix.net/docs/services/assistant/create-skill.html#create-skill. 

   Record the Workspace ID, username, and password (or API key) for Assistant. You can view these values on the Skill details page (opened from the Skill tile by selecting "View API Details"). The username and password (or API key) for Assistant are also usually listed in the Service credentials section of the Assistant service page in your IBM Cloud dashboard.

5. Install dependencies by running the following command in a console, from the main source directory where you downloaded the repository:

   `npm install`

6. The provided sample skill can call an App Connect flow to look up a customer record using an ID. There are two options; using Cloud Functions to make the look up call, or using a client action to do the call. See https://console.bluemix.net/docs/services/conversation/dialog-actions.html#dialog-actions for information about making programmatic calls from a dialog node. Decide on which approach you will initially use.

7. The bot will connect to a specific App Connect flow which has been deployed as an API. The App Connect flow takes the customer ID `id` as a parameter at the end of the URL, for example `https://service.eu.apiconnect.ibmcloud.com/gws/apigateway/api/ca7abf0d8124dc18c0b8cc4f57f20307d3326ae5543d8f71f2ed63c09a14804d/ZJ1eYw/Customer/${id}`. You must deploy your App Connect flow as an API which has this URL format.

   To learn about creating an API using App Connect see [Introduction: Creating flows for an API](https://developer.ibm.com/integration/docs/app-connect/tutorials-for-ibm-app-connect/creating-flows-api/). To learn more about App Connect, see [IBM App Connect Integration Essentials course](https://developer.ibm.com/integration/ibm-app-connect-essentials-course/).

   The sample App Connect flow in `resources/appconnect` does a look up of a Contact in www.salesforce.com using the supplied ID, and exposes this as a REST API in the above format. To use this sample, complete the following steps:
   1. Import the flow into App Connect.
   2. In Operations, Edit the flow and change the Salesforce application where the contact is retrieved from to use your own Salesforce account. 
   3. Start the API 
   4. On the Manage tab, share the API outside of a Cloud Foundry organization to create an API key, and use the API Portal to discover the URL the API is hosted on; for example `https://service.eu.apiconnect.ibmcloud.com/gws/apigateway/api/ca7abf0d8124dc18c0b8cc4f57f20307d3326ae5543d8f71f2ed63c09a14804d/ZJ1eYw/Customer/${id}`

   If you want to know more see [this article](https://developer.ibm.com/integration/docs/app-connect/how-to-guides-for-apps/use-ibm-app-connect-salesforce/) for details of how to create a free developer account and connect it to App Connect.

   Note that an API key is required to use the App Connect flow. Take a note of the value of the App Connect API key.

8. A shell script and Windows batch file have been provided which set the required environment variables, and can be edited to set the correct values, and then run afterward. The script is named `setEnv.sh` and the batch file is `setEnv.bat`. FOr Linux the script should be run using `. ./setEnv.sh`. Alternatively you can set the environment variables from the command line as described in this readme. Note that if you deploy the application to IBM Cloud, you will have to set the environment variables for the application using Cloud Foundry commands.

9. If you wish to deploy to IBM Cloud you require the IBM Cloud CLI. See https://console.bluemix.net/docs/cli/index.html for details of how to install the CLI. It is not essential to deploy to IBM Cloud to test the application.


## To use a Cloud Function

Note you can call a cloud function from a Watson Assistant service in US South or Germany only. Watson Assistant uses the cloud function that is hosted in the same location only. Therefore if you are using Watson Assistant in US South, create the cloud function in US South. If you are using Watson Assistant in Germany, create the cloud function in Germany.

To run with cloud function, from the IBM Cloud Functions console, create a new cloud action in a new package, with a runtime of NodeJS 8 with the code in `resources/cloud_actions/appconnect.js`. In the example workspace the cloud action name is `InvokeAppConnect` in the package `invoke`.

Note in the code, the action calls the URL in `action.url`, and this URL is hardcoded to a specific App Connect flow which has been deployed as an API. The App Connect flow takes the customer ID `id` as a parameter at the end of the URL, for example `https://service.eu.apiconnect.ibmcloud.com/gws/apigateway/api/ca7abf0d8124dc18c0b8cc4f57f20307d3326ae5543d8f71f2ed63c09a14804d/ZJ1eYw/Customer/${id}`. You must deploy your App Connect flow as an API and replace this URL with the URL for your App Connect flow.

Note also that the API key required for the App Connect flow is expected to be in the input parameters to the action. In the sample, the API key should be defined in the action's `Parameters` tab. Add a parameter with name of `apiKey` and value of the API key needed to access the App Connect flow deployed as an API.

It would have been possible for the bot application to pass the App Connect API key to the cloud action. However then the API key would have to be stored in the environment of the bot application, and the bot application author would have access to the key. In this bot, the API key is stored in the cloud action definition and therefore only the cloud action author has access to the API key.

To test the cloud action, you can add another parameter with name of `id` and value of a known customer ID (for example `"0035800001JLVXD"`), and then invoke the action. The results will show the customer details:
```
{
  "CustomerID": "0035800001JLVXD",
  "FirstName": "Sfctest",
  "LastName": "Cloud5",
  "Email_Address": "sfc.cloud5@email.com"
}
```
Ensure you delete the `id` parameter before using the cloud action from the bot.

Once the cloud action is created, record the action name and package.

Edit the bot workspace in Assistant tooling and in the Dialog node `AppConnect / useServerActions` edit the JSON in `Then respond with` on the line `"name": "seager@uk.ibm.com_dev/invoke/InvokeAppConnect",` to indicate the name of your cloud action. The format of this name is `<organization>_<space>/<package>/<action name>`. In the default provided, the organization is `seager@uk.ibm.com`, the space is `dev`, the package is `invoke` and the action name is `InvokeAppConnect`. Assistant will automatically save any changes that you make in the workspace.

Use cloud actions by setting the variable `USE_CLIENT_ACTIONS` in a console. For Unix this is set by the following command:
`export USE_CLIENT_ACTIONS=false`

For Windows use the following command:
`set USE_CLIENT_ACTIONS=false`

Set the cloud action user and password. From the IBM Cloud dashboard Functions section, find the API Key (currently under Getting Started / API Key). The section before the `:` is the username and the section after the `:` is the password.

In Unix:
`export ACTION_USERNAME=<IBM Cloud Functions username>`
`export ACTION_PASSWORD=<IBM Cloud Functions password>`

In Windows replace `export` with `set`.

To run server and client in development mode, set the Assistant username, password and workspace ID you recorded earlier. Run the following commands in the console. In Unix:

`export ASSISTANT_USERNAME=<assistant username>`
`export ASSISTANT_PASSWORD=<assistant password>`
`export WORKSPACE_ID=<workspace id>`

In Windows replace `export` with `set`.

Alternatively if you have an API Key for Assistant, run the following command instead of setting the username and password. In Unix:

`export ASSISTANT_IAM_APIKEY=<assistant API key>`

In Windows replace `export` with `set`.

Skip to [Testing the bot](#testing-the-bot) to try the bot.


## To use a client action

To use client actions, set the variable in Unix:
`export USE_CLIENT_ACTIONS=true`

In Windows replace `export` with `set`.

The value of this environment variable is added to the bot context and sent to Assistant. The workspace will therefore use a client action to connect to App Connect. This is an action that is run by the NodeJS application that hosts the bot UI.

The App Connect flow is deployed as an API with a URL which expects the customer ID at the end, for example `https://service.eu.apiconnect.ibmcloud.com/gws/apigateway/api/ca7abf0d8124dc18c0b8cc4f57f20307d3326ae5543d8f71f2ed63c09a14804d/ZJ1eYw/Customer/<id>`. The App Connect flow API also requires an API key.

Set the App Connect API URL, where a forward slash and the customer ID will be appended to the end. In Unix:
`export SALESF_ENDPOINT=<endpoint>`

Set the App Connect API Key to use in the variable. In Unix:
`export SALESF_APIKEY=<api key>`

For example `export SALESF_ENDPOINT=https://service.eu.apiconnect.ibmcloud.com/gws/apigateway/api/ca7abf0d8124dc18c0b8cc4f57f20307d3326ae5543d8f71f2ed63c09a14804d/ZJ1eYw/Customer`

In Windows replace `export` with `set`.

Skip to [Testing the bot](#testing-the-bot) to try the bot.

# Overview of the Assistant workspace

The bot workspace is deliberately simple.

There is a single intent `#customerDetails` which detects when the user asks to look up customer details and has several examples of utterances.

There is a single entity `@customerId` which attempts to recognise a customer ID such as `0035800001JLVXD` in the utterance. This is done by providing a regular expression to match against. The pattern is looking for part of the utterance with digits and letters of either 15 or 18 characters in length. If your customer ID format is different, you will need to change the pattern to match it.

If the bot finds a match for the regular expression then it will find the entity. However the customerId entity does not set a value, so the entity will be set with no value. In the dialog node `AppConnect` under `Then set context` the context variable `$id` is set to the actual value that the pattern matched using the expression `"<? @customerId.literal ?>"`, and this is how the `customerId` entity is able to get the value that matched the regular expression in the utterance.

The dialog has a welcome node which issues one of two greetings when the bot first starts. It has an `anything_else` node at the bottom which is triggered when the bot does not understand the utterance. The dialog has a node named `AppConnect` which is triggered if the intent `#customerDetails` is recognised. This node uses slots to ask for a value for the `@customerId` entity, and will continue to ask for the customer Id with the phrase `Can you tell me the customer ID?` until the `@customerId` entity is found. As described, once the `@customerId` entity is found the node will set the context variable `$id` to the match of the regular expression. The node is then set to jump to the child nodes, the first of which is `useClientActions`.

The `useClientActions` node has a condition that the context variable `$useClientActions` is true. This context variable is set by the server NodeJS application from the environment variable `USE_CLIENT_ACTIONS` that you set. If client actions is true, the node responds with an actions array with the details of the action and a type of `client`:

```
"actions": [
    {
      "name": "Salesf",
      "type": "client",
      "parameters": {
        "id": "$id"
      },
      "result_variable": "customer"
    }
  ]
```

This indicates to Assistant that it should respond to the server NodeJS application. Assistant will also send back a context variable `skip_user_input` set to true, and the server NodeJS application is checking for this, and will then check for a client action that it knows how to run. The NodeJS application will call some remote API, and place the results in the context variable `customer` and then call Assistant back again.

The node has `And finally` set to jump to the child node which displays the `Email_Address` property of the customer object that it expects to be in the context. When Assistant is called back, it will evaluate the `And finally` and immediately skip to the child node.

If the `useClientActions` context variable is false, then the `useClientActions` node will not be run, and Assistant will process the `useServerActions` node. This runs if the `useClientActions` context variable is false. The node responds with an actions array again but with a type of `cloud_function`:

```
"actions": [
    {
      "name": "seager@uk.ibm.com_dev/invoke/InvokeAppConnect",
      "type": "cloud_function",
      "parameters": {
        "id": "$id"
      },
      "credentials": "$private.actionCredentials",
      "result_variable": "customer"
    }
  ]
```

This indicates to Assistant that it should call a Cloud Function as described in the name, and pass in an `id` parameter using the context variable `$id` as the value. The credentials used to call the Cloud Function are stored in the context variable `$private` as a property named `actionCredentials`. This context variable is set by the server NodeJS application from the environment variables `ACTION_USERNAME` and `ACTION_PASSWORD` that you set. The results of the Cloud Function are placed in the context variable `$customer`.

The node then jumps to the first child node `Cloud call successful`. This node has a condition that if there are no errors, assume the customer details are in the context variable `$customer` and respond with the property `Email_Address`. If there are errors, this node is not run and the next child node `Cloud call error` is run. This will respond with the error that happened in the Cloud Function.


# Testing the bot

To start the server and client in development mode, run the following from the console:

`npm start`

The development server will run on port `3010` and the React development server will run on port `3001`. Your web browser will open to `http://localhost:3001/` and display the bot UI. In the `Type something` field, enter `look up customer` and press enter. The bot will ask for the customer ID. Enter a known customer ID, for example `0035800001JLVXD`, and press enter. After a wait, the bot will respond with `Customer email is sfc.cloud5@email.com.`.

For each bot turn, the user payload and Assistant response payload will update on the right, and historic payloads can be viewed using the `Select payload to view` drop down menu. The console output will also show the payload sent to Assistant and the response payload for each turn.

## Cloud action

If the bot is using cloud actions, then the look up will happen in Assistant and the bot will return the results directly to the application.

## Client action

If the bot is using client actions, the look up will happen over two turns, and the last turn will be displayed in the application. You can switch to the previous turn using the `Select payload to view` drop down menu to see what the bot sent to Assistant and what Assistant sent back.

Note that the initial response contains a `actions` property which has an action name of `Salesf`, a type `client`, a result_variable of `customer` and parameter of `id` with the customer ID that you entered. This signals to the application that it should look up customer details using the provided ID, and place the response in the context in a variable named `customer`.

If you switch to the last payload, in the user input payload you will see in the context the property `customer` has an object with the results of the local look up:
```
"customer": {
      "CustomerID": "0035800001JLVXD",
      "FirstName": "Sfctest",
      "LastName": "Cloud5",
      "Email_Address": "sfc.cloud5@email.com"
    }
  },
```
Assistant is sent this response and knows that it was waiting for the result of a client action, and therefore processes it and sends back the response to display to the user of `Customer email is sfc.cloud5@email.com.`.


# Building and deploying to IBM Cloud

To deploy to IBM Cloud.

Login. For example:

`bx login --sso` or `bx login` or `cf login`

Set org, region and space, for example:

`bx target -o x@email.com -s dev -r us-south`

In the space, region and org where you will push this app, ensure there is a Watson Assistant service.

Edit manifest.yml and specify the Assistant service to bind to in both declared-services and
applications sections. If your Watson Assistant service uses a username and password, and is listed under `Cloud Foundry services` in the IBM Cloud console, then it is a Cloud Foundry service and you use the `services` key. For example if the Watson Assistant service is called 'WatsonAssistant-b0':

```
declared-services:
  WatsonAssistant-b0:
    label: WatsonAssistant-b0
    plan: free
```
```
applications:
- name: conv-bot-xxx-appconnect
  command: npm run server
  path: .
  memory: 512M
  instances: 1
  services:
  - WatsonAssistant-b0
```

If your Watson Assistant service uses an API Key, and is listed under `services` in the IBM Cloud console, then it is a Resource Controller service. Comment out the `services:` section. For example:

```
applications:
- name: conv-bot-xxx-appconnect
  command: npm run server
  path: .
  memory: 512M
  instances: 1
#  services:
#  - WatsonAssistant-b0
```

Edit manifest.yml and set the application name to be unique, replace 'xxx' with
3 numbers:

```
applications:
- name: conv-bot-123-appconnect
```

Push without starting:

`bx cf push --no-start` or `cf push --no-start`

Given the app is bound to the Assistant service, it is not necessary to provide the service credentials in the environment.

If your Assistant service is a Resource Controller service, run the following commands to bind the application to your service:

`bx resource service-binding-create <Assistant service name> conv-bot-123-appconnect Manager`

If your Assistant service is a Cloud Foundry service, then the entries in `manifest.yml` will have made the service bind to the application when you pushed the application.

Set the workspace id where WORKSPACE_ID is from the workspace in the Assistant UI.

`bx cf set-env conv-bot-123-appconnect WORKSPACE_ID <workspace id>`

If using cloud actions, set the action credentials:

`bx cf set-env conv-bot-123-appconnect ACTION_USERNAME <action username>`
`bx cf set-env conv-bot-123-appconnect ACTION_PASSWORD <action password>`

If using client actions, set the flag and the App Connect URL and API key:

`bx cf set-env conv-bot-123-appconnect USE_CLIENT_ACTIONS true`
`bx cf set-env conv-bot-123-appconnect SALESF_APIKEY <api key>`
`bx cf set-env conv-bot-123-appconnect SALESF_ENDPOINT <endpoint>`


Start:

`bx app start conv-bot-123-appconnect`

Navigate to the URL where the application is running and you will see the bot UI. The URL is shown on the app detail page in the IBM Cloud console.


### License

Copyright 2018 David Seager & Ian Larner

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

See also the file LICENSE.
