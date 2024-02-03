import React, { useEffect, useState, useContext, useCallback } from "react";
import { Box, List, Checkbox, CircularProgress, IconButton } from "@mui/material";

import { DeleteOutline, Refresh } from "@mui/icons-material";
import { UidContext } from "../AppContext";
import axios from "axios";
import Note from "./Note";

const Notes = ({ openDrawer, notesEndpoint }) => {
  console.log("Rendering Notes component");
  const [notes, setNotes] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;
  const uid = useContext(UidContext);

  const fetchNotes = useCallback(async () => {
    console.log('Fetching notes...');
    try {
      const response = await axios.get(`${apiUrl}${notesEndpoint}/${uid}`);
      setNotes(response.data);
      setLoading(false);
    } catch (error) {
      console.error(`Error fetching notes from ${notesEndpoint}:`, error);
      // Handle error
      setLoading(false);
    }
  }, [apiUrl, notesEndpoint, uid]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const selectAllNotes = (e) => {
    if (e.target.checked) {
      const allNoteIds = notes.map((note) => note._id);
      setSelectedNotes(allNoteIds);
    } else {
      setSelectedNotes([]);
    }
  };

  const refreshNotes = useCallback(() => {
    setLoading(true);
    setSelectedNotes([]);
    fetchNotes();
  }, [fetchNotes]);

  const deleteSelectedNotes = async () => {
    try {
      await axios.put(`${apiUrl}api/note/movenotetobin/${uid}`, {
        noteIds: selectedNotes,
      });
      // Refresh the notes list after move/delete
      fetchNotes();
      // Clear selected notes
      setSelectedNotes([]);
    } catch (error) {
      console.error("Error moving/deleting selected notes:", error);
    }
  };

  return loading ? (
    <CircularProgress
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  ) : (
    <Box
      style={
        openDrawer
          ? { marginLeft: 220, width: "80%" }
          : { marginLeft: 16, width: "98%" }
      }
    >
      <Box
        style={{
          padding: "20px 10px 0px 10px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Checkbox size="small" onChange={selectAllNotes} />
        <DeleteOutline onClick={deleteSelectedNotes} />
        <IconButton onClick={refreshNotes} color="black">
          <Refresh />
        </IconButton>
      </Box>
      <List style={{ maxHeight: "500px", overflowY: "auto" }}>
        {notes.map((note) => (
          <Note
            note={note}
            key={note._id}
            selectedNotes={selectedNotes}
            setSelectedNotes={setSelectedNotes}
          />
        ))}
      </List>
    </Box>
  );
};

export default Notes;
