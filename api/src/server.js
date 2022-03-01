const express = require('express')
const path = require('path')
const cors = require('cors')
const http = require('http')
const socket = require('socket.io')

const rheaAdapter = require('./rheaAdapter.js')

const app = express()
const server = http.createServer(app);
const io = socket(server, {
  cors: {
    origin: '*',
  }
});

const SERVER_PORT_DEFAULT = 3002
const PORT = process.env.PORT || SERVER_PORT_DEFAULT

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

app.get('/rhea*?', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));;
})

app.get('/notes', (req, res) => {
  send('list')
  rheaAdapter.respond(res)
    .then(message => res.json(message))
    .catch(({ code, message }) => res.status(code).send(message))
})

app.get('/notes/:id', (req, res) => {
  send('read', { id: req.params.id })
  rheaAdapter.respond()
    .then(message => res.json(message))
    .catch(({ code, message }) => res.status(code).send(message))
})

app.post('/notes', (req, res) => {
  send('create', req.body)
  rheaAdapter.respond()
    .then(message => res.json(message))
    .catch(({ code, message }) => res.status(code).send(message))
})

app.put('/notes/:id', (req, res) => {
  send('update', { id: req.params.id, ...req.body })
  rheaAdapter.respond()
    .then(message => res.json(message))
    .catch(({ code, message }) => res.status(code).send(message))
})

app.delete('/notes/:id', (req, res) => {
  send('delete', { id: req.params.id })
  rheaAdapter.respond()
    .then(message => res.json(message))
    .catch(({ code, message }) => res.status(code).send(message))
})

io.on('connection', (socket) => {
  socket.on('updateNotesExceptSender', () => {
    socket.broadcast.emit('refreshNotes', '')
  })
});

server.listen(PORT, function () {
  console.log(`API Server listening on port ${PORT}`)
});

function send(command, payload) {
  rheaAdapter
    .send({ body: { command, payload } })
}

process.on('SIGINT', () => {
  console.log('SIGINT');
  process.exit();
})