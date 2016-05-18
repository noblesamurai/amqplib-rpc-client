# amqplib-rpc-client

Rpc client based on amqplib.

[![build status](https://secure.travis-ci.org/timothyleslieallen/amqplib-rpc-client.png)](http://travis-ci.org/timothyleslieallen/amqplib-rpc-client)

## Installation

This module is installed via npm:

``` bash
$ npm install amqplib-rpc-client
```

## Example Usage

``` js
var amqplibRpcClient = require('amqplib-rpc-client');

amqplibRpcClient(amqpUrl, exchange, 'add', { number1: 1, number2: 4 }).on('data', function(response) {
  expect(response.answer).to.be(5);
  done();
});
```
