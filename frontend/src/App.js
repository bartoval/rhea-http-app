import React from "react";
import NoteCreate from "./NotesCreate";
import Notes from "./NotesList";

const App = () => {
  return (
    <div className="container">
      <h1>Create Note</h1>
      <NoteCreate />
      <hr />
      <h1>Notes</h1>
      <Notes />
    </div>
  );
};
export default App;
