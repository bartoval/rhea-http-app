const http = require('http');
const container = require('rhea');
const notes = require('./notes.js');

let sender = null;

container.on('connection_open', function (context) {
  sender = connection.open_sender('to_client');
  connection.open_receiver('to_database');
});

container.on('message', function ({ message: { body } }) {
  let data = null;
  const { command, payload } = body

  switch (command) {
    case 'list':
      data = notes.listNotes();
      break;
    case 'read':
      data = notes.readNote(payload.id);
      break;
    case 'create':
      notes.addNote(payload.title, payload.description);
      break;
    case 'update':
      const { id, title, description } = payload
      notes.updateNote(id, title, description);
      break;
    case 'delete':
      data = notes.removeNote(payload.id);
      break;
  }

  sender.send({ body: data });
});

const connection = container.connect({ port: 5672 });


const requestListener = function (req, res) {
  res.writeHead(200);
  res.end('Hello, World!');
}

const server = http.createServer(requestListener);
server.listen(3001);
