var expect = require('expect.js');
var amqplibRpcClient = require('..');
var amqp = require('amqplib');
var amqpUrl = process.env.AMQP_URL || 'amqp://localhost';
var exchange = 'test';

describe('amqplib-rpc-client', function () {
  var conn;
  before(function () {
    return amqp.connect(amqpUrl).then(function (_conn) {
      conn = _conn;
      conn.createChannel().then(function (ch) {
        ch.assertExchange(exchange);
        ch.assertQueue('add');
        ch.bindQueue('add', exchange, 'add');
        return ch.consume('add', onMessage);

        function onMessage (message) {
          var payload = JSON.parse(message.content.toString());
          var response = { type: 'data', answer: payload.number1 + payload.number2 };
          ch.publish(exchange, message.properties.replyTo, Buffer.from(JSON.stringify(response)));
          ch.ack(message);
        }
      });
    });
  });

  after(function () {
    // HACK(tim): Need a proper was to close the connection...!
    return conn.close().then(() => process.exit());
  });

  it('should send and receive a response', function (done) {
    amqplibRpcClient(amqpUrl, exchange, 'add', { number1: 1, number2: 4 }).on('data', function (response) {
      expect(response.answer).to.be(5);
      done();
    });
  });
});
