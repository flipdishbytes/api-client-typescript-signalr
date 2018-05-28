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
import { OrderCreatedEvent } from "@flipdish/api-client-typescript";
import { AuthorizationReply, SignalR } from "@flipdish/api-client-typescript-signalr";

//Keep in mind that this should only be created once per WebApp
var connection = new SignalR(onConnected);

function onConnected(){
    console.log("Connected to SignalR");
    connection.AuthorizationHub.authenticate().then(onAuthenticated);
    connection.OrdersHub.OnOrderCreated(onOrderCreated);
}

function onAuthenticated(auth: AuthorizationReply) {
    console.log("Authentication result:");
    console.log(auth);
}

function onOrderCreated(order: OrderCreatedEvent) {
    console.log("Order created result:");
    console.log(order);
}
```