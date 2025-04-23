const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// In-memory store for URL mappings
const urlDatabase = {};
let shortUrlCounter = 1;

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  try {
    const parsedUrl = new URL(originalUrl);

    dns.lookup(parsedUrl.hostname, (err, address) => {
      if (err || !address) {
        res.json({ error: 'invalid url' });
        return;
      }

      const shortUrl = shortUrlCounter++;
      urlDatabase[shortUrl] = originalUrl;
      res.json({ original_url: originalUrl, short_url: shortUrl });
    });
  } catch (error) {
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:shorturl', (req, res) => {
  const shortUrl = parseInt(req.params.shorturl);
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'invalid short url' });
  }
});

app.get('/', (req, res) => {
  res.send('URL Shortener Microservice is running!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});