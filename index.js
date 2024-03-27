require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;
const { Note } = require("./models/note");

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
app.use(requestLogger);
app.use(cors());
app.use(express.static("dist"));

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

// const generateId = () => {
//   const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
//   return maxId + 1;
// };

app.get("/", (req, res) => {
  res.send("<h1>This is a my API for notes</h1>");
});

app.get("/api/notes", (req, res) => {
  Note.find().then((notes) => {
    res.status(200).json(notes);
  });
});

app.get("/api/notes/:id", (req, res, next) => {
  const id = req.params.id;

  Note.findById(id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).send({ message: "not found" });
      }
    })
    .catch((error) => next(error));
});

app.post("/api/notes", (req, res, next) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => {
      res.json(savedNote);
    })
    .catch((error) => next(error));
});

app.put("/api/notes/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const note = { ...body };

  Note.findByIdAndUpdate(id, note, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findByIdAndDelete(id)
    .then((noteDeleted) => {
      if (noteDeleted) {
        res.status(204).end();
      } else {
        res.status(404).send({ message: "not found" });
      }
    })
    .catch((error) => next(error));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//middleware para solicitudes desconocidas
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.log(error);
  if (error.name === "CastError") {
    res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    res.status(400).send({ error: error.message });
  }
  next();
};

app.use(errorHandler);
