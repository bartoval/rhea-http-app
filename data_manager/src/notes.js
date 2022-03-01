const fs = require('fs')
const chalk = require('chalk')
const uuid = require('uuid')

const FILE_PATH = process.env.RHEA_DATASTORE_PATH || './notes.json'
console.log('The notes are stored to: ', FILE_PATH)

const addNote = (title, body) => {
  const notes = loadNotes()

  notes.push({
    id: uuid.v4(),
    title: title,
    body: body,
    modified: Date.now()
  })
  saveNotes(notes)
  console.log(chalk.green.inverse('New note added!'))
}

const removeNote = (id) => {
  const notes = loadNotes()
  const notesToKeep = notes.filter((note) => note.id !== id)

  if (notes.length > notesToKeep.length) {
    console.log(chalk.green.inverse('Note removed!'))
    saveNotes(notesToKeep)
  } else {
    console.log(chalk.red.inverse('No note found!'))
  }
}

const listNotes = () => {
  const notes = loadNotes()

  console.log(chalk.inverse('Your notes'))

  notes.forEach((note) => {
    console.log(note.title)
  })

  return notes
}

const readNote = (id) => {
  const notes = loadNotes()
  const note = notes.find((note) => note.id === id)

  if (note) {
    console.log(chalk.inverse(note.id))
    console.log(note.body)

    return note
  } else {
    console.log(chalk.red.inverse('Note not found!'))

    return null
  }
}

const updateNote = (id, title, body) => {
  const notes = loadNotes()
  const noteIndex = notes.findIndex((note) => note.id === id)

  if (noteIndex >= 0) {
    const note = notes[noteIndex]
    notes[noteIndex] = { id: note.id, title, body, modified: Date.now() }

    saveNotes(notes)
    console.log(chalk.green.inverse('Note updated!'))
  }
}

const saveNotes = (notes) => {
  const dataJSON = JSON.stringify(notes)
  fs.writeFileSync(FILE_PATH, dataJSON)
}

const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync(FILE_PATH)
    const dataJSON = dataBuffer.toString()
    return JSON.parse(dataJSON)
  } catch (e) {
    return []
  }
}

module.exports = {
  addNote,
  removeNote,
  listNotes,
  readNote,
  updateNote
}