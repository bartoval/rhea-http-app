import React, { useState, useEffect, } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

import { API_HOST } from "./environment/constants"

const SET_NOTE_PATH = '/rhea/note'

const Notes = () => {
  const [notes, setNotes] = useState(null)
  const navigate = useNavigate()

  async function fetchNotes() {
    const res = await axios.get(`${API_HOST}/notes`)
    setNotes(res.data)
  }

  async function handleDelete(id) {
    await axios.delete(`${API_HOST}/notes/${id}`)
    fetchNotes()
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const renderedNotes = notes && Object.values(notes).map(({ id, title, body }) => {
    return (
      <div
        className="card text-dark bg-light border-secondary"
        style={{ width: "30%", marginBottom: "20px", marginRight: "20px", maxWidth: "18rem" }}
        key={id}
      >
        <div
          className="card-body  text-secondary"
          style={{ maxHeight: "200px", overflow: "auto" }}>
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{body}</p>
        </div>

        <div className="card-footer d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate(SET_NOTE_PATH, { state: { id, title, description: body } })}>
            <i className="bi bi-pencil-fill"></i>
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => handleDelete(id)}>
            <i className="bi bi-trash3-fill"></i>
          </button>
        </div>
      </div >
    )
  })

  return (
    <>
      <h3>Notes</h3>
      <hr />
      {notes
        ? <> {
          notes.length
            ? <>
              <button
                type="button"
                className="btn btn-outline-primary mb-3"
                onClick={() => navigate(SET_NOTE_PATH)}>
                Create new Note
              </button>
              <div className="d-flex flex-row flex-wrap">
                {renderedNotes}
              </div>
            </>
            : <div className="alert alert-warning text-center" role="alert">
              <p className="d-flex justify-content-center align-items-baseline">Your notes space is empty,
                <button className="btn btn-link p-0" onClick={() => navigate(SET_NOTE_PATH)}> click here to add one</button>
              </p>
            </div>
        }</>
        : <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status" />
        </div>
      }
    </>
  )
}

export default Notes
