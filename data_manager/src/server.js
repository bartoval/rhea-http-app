const container = require('rhea')
const notes = require('./notes.js')

let sender = null

const LINK_NAME_DATA_MANAGER = 'note-store'
const SERVICE_NAME = process.env.RHEA_DATASTORE_HOST || 'localhost'

container.on('connection_open', function (context) {
  sender = connection.open_sender()
  connection.open_receiver(LINK_NAME_DATA_MANAGER)

  console.log('connection open', SERVICE_NAME)
})

container.on('message', function ({ message: { reply_to, body } }) {
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

  sender.send({ to: reply_to, body: data })
})

const connection = container.connect({ host: SERVICE_NAME })

process.on('SIGINT', () => {
  console.log('SIGINT');
  process.exit();
})
