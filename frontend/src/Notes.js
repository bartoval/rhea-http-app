import React, { useState, useEffect } from "react";
import axios from "axios";

const Notes = () => {
  const [notes, setNotes] = useState({});

  const fetchNotes = async () => {
    const res = await axios.get("http://localhost:3002/notes");

    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const renderedNotes = Object.values(notes).map(({ id, title, body }) => {
    return (
      <div
        className="card"
        style={{ width: "30%", marginBottom: "20px" }}
        key={id}
      >
        <div className="card-body">
          <h3>{title}</h3>
          <h5>{body}</h5>
        </div>
      </div>
    );
  });

  return (
    <div className="d-flex flex-row flex-wrap justify-content-between">
      {renderedNotes}
    </div>
  );
};

export default Notes;
