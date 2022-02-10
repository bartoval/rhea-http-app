import React from "react"
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"

import NoteCreate from "./NotesCreate"
import Notes from "./Notes"
import { APP_NAME } from "./environment/constants"

const App = () => {
  return (
    <>
      <div className="p-3 mb-2 bg-primary bg-gradient text-white">
        <h1>{APP_NAME}</h1>
      </div>
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Notes />} />
            <Route path="/note" element={<NoteCreate />} />
          </Routes>
        </BrowserRouter>
      </div >
    </>
  )
}
export default App
