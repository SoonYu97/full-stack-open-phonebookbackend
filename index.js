const express = require("express");
const app = express();

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
  {
    id: 5,
    name: "Mary2 Poppendieck",
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

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id)
  persons = persons.filter((p) => p.id !== id);
  console.log(persons)
  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
