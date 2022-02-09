const container = require('rhea');

let sender = null;

container.on('connection_open', function (context) {
  sender = connection.open_sender('to_database');
  connection.open_receiver('to_client');
});

function respond() {
  return new Promise(function (resolve, reject) {
    container.on('message', function ({ message }) {
      resolve(message.body)
    });
  })
}

function getSender() {
  return sender
}

const connection = container.connect({ port: 5672 });


module.exports = {
  respond,
  getSender
}