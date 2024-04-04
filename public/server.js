const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
// Route to serve notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Catch-all route to redirect to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
// Helper function to read and write to the db.json file
const readWriteNotes = (callback) => {
  fs.readFile("db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    callback(notes, (updatedNotes) => {
      fs.writeFile("db/db.json", JSON.stringify(updatedNotes), (err) => {
        if (err) throw err;
      });
    });
  });
};

// GET route for fetching notes
app.get("/api/notes", (req, res) => {
  readWriteNotes((notes, _) => res.json(notes));
});

// POST route for saving a new note
app.post("/api/notes", (req, res) => {
  const newNote = req.body;

  readWriteNotes((notes, updateNotes) => {
    newNote.id = Date.now().toString(); // Simple unique ID
    notes.push(newNote);
    updateNotes(notes);
    res.json(newNote);
  });
});
