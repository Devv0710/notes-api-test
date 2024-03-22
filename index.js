const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

const requestLogger = (req, res, next) => {
  console.log("Method: ", req.method);
  console.log("Path: ", req.path);
  console.log("Body: ", req.body);
  console.log("---");
  next();
};
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

// transform a json en contenido de una solicitud del body
app.use(express.json());
// app.use(requestLogger);
app.use(cors());

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.get("/", (req, res) => {
  res.send("<h1>This is a my API for notes</h1>");
});

app.get("/api/notes", (req, res) => {
  res.status(200).json(notes);
});

app.get("/api/notes/:id", (req, res) => {
  const id = +req.params.id;
  const note = notes.find((note) => note.id === id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.post("/api/notes", (req, res) => {
  const body = req.body;
  if (!body.content) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  };
  notes = notes.concat(note);
  res.json(note);
});

app.put("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  console.log(body);
  console.log(id);
});
app.delete("/api/notes/:id", (req, res) => {
  const id = +req.params.id;
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use(unknownEndpoint);
