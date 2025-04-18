const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port = 3000;

app.get('/api/:date?', (req, res) => {
  const dateParam = req.params.date;
  let date;

  if (!dateParam) {
    date = new Date();
    res.json({ unix: date.getTime(), utc: date.toUTCString() });
    return;
  }

  if (!isNaN(dateParam)) {
    date = new Date(parseInt(dateParam));
  } else {
    date = new Date(dateParam);
  }

  if (isNaN(date.getTime())) {
    res.json({ error: 'Invalid Date' });
  } else {
    res.json({ unix: date.getTime(), utc: date.toUTCString() });
  }
});

app.get('/', (req, res) => {
  res.send('Timestamp Microservice is running!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});