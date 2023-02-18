require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const {
  unknownEndpoint,
  errorHandler,
} = require("./middlewares/error_handling");

const app = express();

morgan.token("reqbody", function (req, res) {
  return Object.keys(req.body).length ? JSON.stringify(req.body) : "";
});

const morgenstr =
  ":method :url :status :res[content-length] - :response-time ms :reqbody";

app.use(express.static("build"));
app.use(express.json());
app.use(morgan(morgenstr));
app.use(cors());

app.get("/info", (req, res) => {
  const unix_timestamp = Date.now();
  var date = new Date(unix_timestamp);
  Person.find({}).then((persons) => {
    output = `<p>Phonebook has info for ${
      persons.length
    } people</p><p>${date.toString()}</p>`;
    res.send(output);
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (
    body.name === undefined ||
    body.number === undefined ||
    body.name === "" ||
    body.number === ""
  ) {
    const message = { error: `must include name and number` };
    return res.status(400).json(message);
  }
  const person = new Person(body);
  person.save().then((savedperson) => {
    res.json(savedperson);
  });
});

app.put("/api/persons/:id", (req, res) => {
  const body = req.body;
  Person.countDocuments({ name: body.name }, { limit: 1 }).then((count) => {
    if (count !== 1) {
      const message = { error: `id not found to be updated` };
      return res.status(404).json(message);
    }
  });

  Person.findByIdAndUpdate(req.params.id, body, { new: true })
    .then((updatedPerson) => {
      console.log(updatedPerson);
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
