const container = require('rhea')

const MAX_NUMBER_OF_RETRY = 100
const MAX_DELAY_RETRY = 50
const LINK_NAME_DATA_MANAGER = 'to_database'
const LINK_NAME_CLIENT = 'to_client'
const RHEA_PORT = 5672

let sender = null
let messageValue = false
let retry = 0

container.on('connection_open', function (context) {
  sender = connection.open_sender(LINK_NAME_DATA_MANAGER)
  connection.open_receiver(LINK_NAME_CLIENT)
})

container.on('message', function ({ message }) {
  messageValue = message.body
})

const connection = container.connect({ port: RHEA_PORT })

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

function getSender() {
  return sender
}

module.exports = {
  respond,
  getSender
}