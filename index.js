require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const res = require("express/lib/response");

const app = express();

morgan.token("reqbody", function (req, res) {
  return Object.keys(req.body).length ? JSON.stringify(req.body) : "";
});

app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :reqbody"
  )
);
app.use(cors());
app.use(express.static("build"));

app.get("/info", (request, response) => {
  const unix_timestamp = Date.now();
  var date = new Date(unix_timestamp);
  Person.find({}).then((persons) => {
    output = `<p>Phonebook has info for ${
      persons.length
    } people</p><p>${date.toString()}</p>`;
    response.send(output);
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((error) => {
      const message = { error: `person with id: ${id} not found` };
      console.log(error);
      response.status(404).json(message);
    });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (body.name === undefined || body.number === undefined) {
    const message = { error: `must include name and number` };
    return response.status(400).json(message);
  }
  // } else if (Person.find({name: person.name})) {
  //   const message = { error: `name must be unique` };
  //   response.status(303).json(message);
  const person = new Person(body);
  person.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
