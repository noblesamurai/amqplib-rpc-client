var amqp = require('amqplib');
var events = require('events');

module.exports = function (amqpUrl, exchange, routingKey, message) {
  var emitter = new events.EventEmitter();
  process.nextTick(function () {
    // Connect to the AMQP server
    amqp.connect(amqpUrl).then(function (conn) {
      // Need a channel to talk to it over
      conn.createChannel().then(function (ch) {
        // Create the queue we'll listen for the response on.
        // ch.assertQueue with blank arg will assert random named queue, used
        // for replyTo.
        ch.assertQueue().then(function (asserted) {
          ch.bindQueue(asserted.queue, exchange, asserted.queue); // Bind response queue so it gets response.
          ch.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), { replyTo: asserted.queue });
          ch.consume(asserted.queue, onMessage);
        });

        function onMessage (message) {
          var payload = JSON.parse(message.content.toString());
          ch.ack(message);
          if (payload.complete) conn.close();
          emitter.emit(payload.type, payload);
        }
      });
    });
  });
  return emitter;
};
