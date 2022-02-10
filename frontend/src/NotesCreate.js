import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"

import { API_HOST } from "./environment/constants"

const NoteCreate = () => {
  const { state } = useLocation()
  const navigate = useNavigate()

  const [title, setTitle] = useState((state && state.title) || '')
  const [description, setDescription] = useState((state && state.description) || '')

  async function handleSubmit(event) {
    event.preventDefault()

    if (state && state.id) {
      await axios.put(`${API_HOST}/notes/${state.id}`, {
        title, description
      })
    } else {
      await axios.post(`${API_HOST}/notes`, {
        title, description
      })
    }

    setTitle("")
    setDescription("")
    navigate('/')
  }

  function getTitle() {
    return state ? `Edit Note (${state.id})` : 'Create a new Note'
  }

  return (
    <div>
      <h1>{getTitle()}</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
          />
        </div>
        <button className="btn btn-primary mt-sm-2">Submit</button>
      </form >
    </div >
  )
}

export default NoteCreate
