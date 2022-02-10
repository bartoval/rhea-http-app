const express = require('express')
const Promise = require('promise')
const cors = require('cors')
const rheaAdapter = require('./rheaAdapter.js')

const app = express()

const SERVER_PORT_DEFAULT = 3002

app.set('port', process.env.PORT || SERVER_PORT_DEFAULT)
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('')
})

app.get('/notes', (req, res) => {
  send("list")
  rheaAdapter.respond(res)
    .then(message => res.json(message))
    .catch(({ code, message }) => res.status(code).send(message))
})

app.get('/notes/:id', (req, res) => {
  send("read", { id: req.params.id })
  rheaAdapter.respond()
    .then(message => res.json(message))
    .catch(({ code, message }) => res.status(code).send(message))
})

app.post('/notes', (req, res) => {
  send("create", req.body)
  rheaAdapter.respond()
    .then(message => res.json(message))
    .catch(({ code, message }) => res.status(code).send(message))
})

app.put('/notes/:id', (req, res) => {
  send("update", { id: req.params.id, ...req.body })
  rheaAdapter.respond()
    .then(message => res.json(message))
    .catch(({ code, message }) => res.status(code).send(message))
})

app.delete('/notes/:id', (req, res) => {
  send("delete", { id: req.params.id })
  rheaAdapter.respond()
    .then(message => res.json(message))
    .catch(({ code, message }) => res.status(code).send(message))
})

app.listen(app.get('port'), () => {
  console.log(`API Server listening on port ${app.get('port')}`)
})

function send(command, payload) {
  rheaAdapter
    .send({ body: { command, payload } })
}

process.on('SIGINT', () => {
  console.log('SIGINT');
  process.exit();
})