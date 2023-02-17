const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

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

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  const unix_timestamp = Date.now();
  var date = new Date(unix_timestamp);
  output = `<p>Phonebook has info for ${
    persons.length
  } people</p><p>${date.toString()}</p>`;
  response.send(output);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => p.id === id);
  if (person) {
    response.json(person);
  } else {
    const message = { error: `person with id: ${id} not found` };
    response.status(404).json(message);
  }
});

app.post("/api/persons", (request, response) => {
  const person = request.body;
  if (!person.hasOwnProperty("name") || !person.hasOwnProperty("number")) {
    const message = { error: `must include name and number` };
    response.status(400).json(message);
  } else if (persons.find((p) => p.name === person.name)) {
    const message = { error: `name must be unique` };
    response.status(303).json(message);
  } else {
    const id = Math.floor(Math.random() * 1000);
    const package = { id, ...person };
    persons = persons.concat(package);
    response.status(201).json(package);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
