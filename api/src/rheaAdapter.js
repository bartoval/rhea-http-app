const container = require('rhea')

const MAX_NUMBER_OF_RETRY = 100
const MAX_DELAY_RETRY = 50
const LINK_NAME_DATA_MANAGER = 'note-store'
const AMQP_PORT = 10000

let sender = null
let connection;
let reply_receiver;
let reply_addr;
let messageValue = false
let retry = 0

container.on('connection_open', function (context) {
  connection = context.connection;
  reply_receiver = connection.open_receiver({ source: { dynamic: true } })
})

container.on('receiver_open', function (context) {
  if (context.receiver == reply_receiver) {
    reply_addr = context.receiver.source.address;
    sender = connection.open_sender(LINK_NAME_DATA_MANAGER)
    console.log(`Reply address: ${reply_addr}`);
  }
})

container.on('message', function ({ message }) {
  messageValue = message.body
})

const listener = container.listen({ port: AMQP_PORT })
console.log(`Backend interface listening on port ${AMQP_PORT}`);

function waitingMessageFromRhea(resolve, reject) {
  if (retry === MAX_NUMBER_OF_RETRY) {
    reject({ code: 408, message: 'Request timeout from rhea' })
  }

  if (messageValue !== false) {
    resolve(messageValue)
  } else {
    retry++
    setTimeout(waitingMessageFromRhea.bind(this, resolve, reject), MAX_DELAY_RETRY)
  }
}

/**
 * Wait for a message from the rhea link event, before resolving the Promise.
 * @returns Promise
 */
const respond = () => {
  messageValue = false
  retry = 0
  return new Promise(waitingMessageFromRhea)
}

function send(message) {
  message.reply_to = reply_addr;
  sender.send(message)
}

module.exports = {
  respond,
  send
}
