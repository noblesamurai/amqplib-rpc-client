# amqplib-rpc-client

Rpc client based on amqplib.

[![build status](https://secure.travis-ci.org/timothyleslieallen/amqplib-rpc-client.png)](http://travis-ci.org/timothyleslieallen/amqplib-rpc-client)

## Installation

This module is installed via npm:

``` bash
$ npm install amqplib-rpc-client
```

## Example Usage

```js
const client = require('amqp-service').client({ url , exchange });
const opts = { progress: function () {} );
const cb = function (data) { console.log(data); }
const request = client.request('add', { number1: 1, number2: 4 }, opts, cb);
});

client.close();
```

```js
const server = require('amqp-service').server({ url , exchange });
const cb = function (input) {
  return Promise.resolve('result!');
};
const server.handler('add',  cb);
server.close();
```

## Usage/conventions
Uses the `replyTo` field to transmit the expected routingKey a response should be publish on by the server.
Expects message to be valid JSON.
Will `emit()` events based on the `type` field of the message content.  The entire JSON object is given as arg 2.  e.g:
`emit('data', { type: 'data', result: 'moo' });`

## Running tests
```
npm test
```

To run the tests RabbitMQ is required. Either install it with your package
manager, or use docker to run a RabbitMQ instance.

```
docker run -d --name amqp.test -p 5672:5672 rabbitmq
```
