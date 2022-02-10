import React, { useState, useEffect, } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Notes = () => {
  const [notes, setNotes] = useState({});
  const navigate = useNavigate();

  const fetchNotes = async () => {
    const res = await axios.get("http://localhost:3002/notes");
    setNotes(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3002/notes/${id}`);
    fetchNotes();
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  const renderedNotes = Object.values(notes).map(({ id, title, body }) => {
    return (
      <div
        className="card text-dark bg-light m-2 border-secondary"
        style={{ width: "30%", marginBottom: "20px", maxWidth: "18rem" }}
        key={id}
      >
        <div className="card-body  text-secondary" style={{ maxHeight: "200px", overflow: "auto" }}>
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{body}</p>
        </div>

        <div className="card-footer d-flex justify-content-between">
          <button type="button" className="btn btn-primary" onClick={() => navigate("/note", {
            state: {
              id, title, body
            }
          })}>
            <i className="bi bi-pencil-fill"></i>
          </button>
          <button type="button" className="btn btn-danger" onClick={() => handleDelete(id)}>
            <i className="bi bi-trash3-fill"></i>
          </button>
        </div>
      </div >
    );
  });

  return (
    <>
      <h1>Notes</h1>
      <hr />
      <button type="button" className="btn btn-outline-primary mb-3" onClick={() => navigate('/note')}>
        Create new Note
      </button>
      <div className="d-flex flex-row flex-wrap">
        {renderedNotes}
      </div>
    </>
  );
};

export default Notes;
