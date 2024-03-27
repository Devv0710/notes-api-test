const mongoose = require("mongoose");

const PASS = process.argv[2];
const URI = `mongodb+srv://admin:${PASS}@cluster0.swcphwt.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);
mongoose.connect(URI);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const note = new Note({
  content: "prueba numero 2",
  important: false,
});

Note.find().then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});

// note.save().then((result) => {
//   console.log("note saved");
//   console.log(result.content);
//   mongoose.connection.close();
// });
