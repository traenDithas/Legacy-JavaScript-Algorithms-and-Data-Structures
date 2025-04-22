const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port = 3000;

app.get('/api/whoami', (req, res) => {
  const ipaddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const language = req.headers['accept-language'];
  const software = req.headers['user-agent'];

  res.json({ ipaddress, language, software });
});

app.get('/', (req, res) => {
  res.send('Request Header Parser Microservice is running!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});