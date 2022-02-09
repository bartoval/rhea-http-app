const chalk = require('chalk')
const yargs = require('yargs')
const notes = require('./notes.js')

// Customize yargs version
yargs.version('1.1.0')

// Create add command
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string'
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string'
    }
  },
  handler(argv) {
    notes.addNote(argv.title, argv.body)
  }
})

// Create remove command
yargs.command({
  command: 'remove',
  describe: 'Remove a note',
  builder: {
    id: {
      describe: 'Note title',
      demandOption: true,
      type: 'string'
    }
  },
  handler(argv) {
    notes.removeNote(argv.id)
  }
})

// Create update command
yargs.command({
  command: 'update',
  describe: 'update a note',
  builder: {
    id: {
      describe: 'Note id',
      demandOption: true,
      type: 'string'
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string'
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string'
    }
  },
  handler(argv) {
    notes.updateNote(argv.id, argv.title, argv.body)
  }
})

// Create list command
yargs.command({
  command: 'list',
  describe: 'List your notes',
  handler() {
    notes.listNotes()
  }
})

// Create read command
yargs.command({
  command: 'read',
  describe: 'Read a note',
  builder: {
    id: {
      describe: 'Note title',
      demandOption: true,
      type: 'string'
    }
  },
  handler(argv) {
    notes.readNote(argv.id)
  }
})

yargs.parse()