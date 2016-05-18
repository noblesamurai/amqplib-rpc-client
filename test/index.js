var expect = require('expect.js'),
    amqplibRpcClient = require('..'),
    amqp = require('amqplib'),
    amqpUrl = process.env.AMQP_URL || 'amqp://localhost',
    exchange = 'test';

before(function() {
  return amqp.connect(amqpUrl).then(function(conn) {
    conn.createChannel().then(function(ch) {
      ch.assertExchange(exchange);
      ch.assertQueue('add');
      ch.bindQueue('add', exchange, 'add');
      return ch.consume('add', onMessage);

      function onMessage(message) {
        var payload = JSON.parse(message.content.toString());
        var response = { type: 'data', answer: payload.number1 + payload.number2 };
        ch.publish(exchange, message.properties.replyTo, new Buffer(JSON.stringify(response)));
        ch.ack(message);
      }
    });
  });
});

describe('amqplib-rpc-client', function() {
  it('should send and receive a response', function(done) {
    amqplibRpcClient(amqpUrl, exchange, 'add', { number1: 1, number2: 4 }).on('data', function(response) {
      expect(response.answer).to.be(5);
      done();
    });
  });
});
