const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// In-memory storage for users and exercises
const users = [];
let userIdCounter = 1;

app.post('/api/users', (req, res) => {
  const username = req.body.username;
  if (username) {
    const newUser = {
      username: username,
      _id: userIdCounter.toString()
    };
    users.push(newUser);
    userIdCounter++;
    res.json(newUser);
  } else {
    res.json({ error: 'Username is required' });
  }
});

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users/:_id/exercises', (req, res) => {
  const id = req.params._id;
  const { description, duration, date } = req.body;

  const user = users.find(user => user._id === id);

  if (!user) {
    return res.json({ error: 'User not found' });
  }

  const durationNumber = parseInt(duration);
  if (isNaN(durationNumber)) {
    return res.json({ error: 'Duration must be a number' });
  }

  const exerciseDate = date ? new Date(date) : new Date();
  if (isNaN(exerciseDate.getTime())) {
    return res.json({ error: 'Invalid date' });
  }

  const newExercise = {
    description,
    duration: durationNumber,
    date: exerciseDate.toDateString()
  };

  if (!user.exercises) {
    user.exercises = [];
  }
  user.exercises.push(newExercise);

  const response = {
    _id: user._id,
    username: user.username,
    date: newExercise.date,
    duration: newExercise.duration,
    description: newExercise.description
  };

  res.json(response);
});

app.get('/api/users/:_id/logs', (req, res) => {
  const id = req.params._id;
  const { from, to, limit } = req.query;

  const user = users.find(user => user._id === id);

  if (!user) {
    return res.json({ error: 'User not found' });
  }

  let log = user.exercises || [];

  if (from) {
    const fromDate = new Date(from);
    if (!isNaN(fromDate.getTime())) {
      log = log.filter(exercise => new Date(exercise.date) >= fromDate);
    }
  }

  if (to) {
    const toDate = new Date(to);
    if (!isNaN(toDate.getTime())) {
      log = log.filter(exercise => new Date(exercise.date) <= toDate);
    }
  }

  if (limit) {
    const limitNumber = parseInt(limit);
    if (!isNaN(limitNumber) && limitNumber >= 0) {
      log = log.slice(0, limitNumber);
    }
  }

  res.json({
    _id: user._id,
    username: user.username,
    count: log.length,
    log: log
  });
});

app.get('/', (req, res) => {
  res.send('Exercise Tracker Microservice is running!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});