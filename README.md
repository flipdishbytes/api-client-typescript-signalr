# @flipdish/api-client-typescript-signalr
Typescript Flipdish SignalR client
## Installation 
```sh
npm install @flipdish/api-client-typescript-signalr --save
yarn add @flipdish/api-client-typescript-signalr
bower install @flipdish/api-client-typescript-signalr --save
```
## Usage
### TypeScript
```typescript
import * as FlipdishSignalR from '@flipdish/api-client-typescript-signalr';
import { OrderCreatedEvent } from "@flipdish/api-client-typescript";

//You can also create configuration without passing anything, it will use default values
let configuration = new FlipdishSignalR.SignalRConfiguration(
  "API endpoint",
  "BEARER TOKEN, if not required pass `undefined`",
  "Logging, to enable pass `true`, to disable pass `false`"
);

//You should create the connection once per application
let connection = new FlipdishSignalR.SignalR(configuration);
//You can subscribe before starting connection
//connection.OrdersHub.OnOrderCreated(onOrderCreated);
//The callback will be called once the connection is started
connection.Start(onConnected);
//You can also subscribe after starting connection
connection.OrdersHub.OnOrderCreated(onOrderCreated);

function onConnected(){
    //Authenticating is a required step and can only be done AFTER the connection is started, hence why it is in this callback
    connection.AuthorizationHub.authenticate().then(onAuthenticated);
}

function onAuthenticated(auth: AuthorizationReply) {
    console.log(auth);
}

function onOrderCreated(order: OrderCreatedEvent) {
    console.log(order);
}
```
