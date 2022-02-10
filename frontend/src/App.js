import React from "react"
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"

import NoteCreate from "./NotesCreate"
import Notes from "./Notes"

const App = () => {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Notes />} />
          <Route path="/note" element={<NoteCreate />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App
