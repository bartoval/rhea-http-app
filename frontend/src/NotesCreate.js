import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const NoteCreate = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleSubmit = async (event) => {
    console.log('submit')
    event.preventDefault();

    if (state && state.id) {
      await axios.put(`http://localhost:3002/notes/${state.id}`, {
        title, description
      });
    } else {
      await axios.post("http://localhost:3002/notes", {
        title, description
      });
    }

    setTitle("");
    setDescription("");
    navigate('/')
  };

  return (
    <div>
      <h1>Create Note</h1>

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
  );
};

export default NoteCreate;
