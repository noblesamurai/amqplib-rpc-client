var expect = require('expect.js'),
    amqplibRpcClient = require('..');

describe('amqplib-rpc-client', function() {
  it('should say hello', function(done) {
    expect(amqplibRpcClient()).to.equal('Hello, world');
    done();
  });
});
