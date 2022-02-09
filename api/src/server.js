const express = require('express');
const Promise = require('promise');
const cors = require('cors');
const rheaAdapter = require('./rheaAdapter.js');

const app = express();


app.set('port', process.env.PORT || 3002);
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('')
})

app.get('/notes', (req, res) => {
  send("list")
  rheaAdapter.respond(res).then(message => res.json(message))
})

app.get('/notes/:id', (req, res) => {
  send("read", { id: req.params.id })
  rheaAdapter.respond().then(message => res.json(message))
})

app.post('/notes', (req, res) => {
  send("create", req.body)
  rheaAdapter.respond().then(message => res.json(message))
})

app.put('/notes/:id', (req, res) => {
  send("update", { id: req.params.id, ...req.body })
  rheaAdapter.respond().then(message => res.json(message))
})

app.delete('/notes/:id', (req, res) => {
  send("delete", { id: req.params.id })
  rheaAdapter.respond().then(message => res.json(message))
})

app.listen(app.get('port'), () => {
  console.log(`Server listening on port ${app.get('port')}`);
});

function send(command, payload) {
  rheaAdapter
    .getSender()
    .send({ body: { command, payload } })
}