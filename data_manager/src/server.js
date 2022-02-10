const http = require('http')
const container = require('rhea')
const notes = require('./notes.js')

let sender = null

const SERVER_PORT = process.env.PORT || 3001
const LINK_NAME_DATA_MANAGER = 'to_database'
const LINK_NAME_CLIENT = 'to_client'
const RHEA_PORT = 5672

container.on('connection_open', function (context) {
  sender = connection.open_sender(LINK_NAME_CLIENT)
  connection.open_receiver(LINK_NAME_DATA_MANAGER)
})

container.on('message', function ({ message: { body } }) {
  let data = null
  const { command, payload } = body

  switch (command) {
    case 'list':
      data = notes.listNotes()
      break
    case 'read':
      data = notes.readNote(payload.id)
      break
    case 'create':
      notes.addNote(payload.title, payload.description)
      break
    case 'update':
      const { id, title, description } = payload
      notes.updateNote(id, title, description)
      break
    case 'delete':
      notes.removeNote(payload.id)
      break
  }

  sender.send({ body: data })
})

const connection = container.connect({ port: RHEA_PORT })

const requestListener = function (req, res) {
  res.writeHead(200)
  res.end('Server created')
}

const server = http.createServer(requestListener)
server.listen(SERVER_PORT, () => console.log(`Server Data Manager listening on port ${SERVER_PORT}`)
)

process.on('SIGINT', () => {
  console.log('SIGINT');
  process.exit();
})