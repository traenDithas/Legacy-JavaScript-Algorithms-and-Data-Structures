const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();

app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static('public'));

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) {
    return res.json({ error: 'No file uploaded' });
  }
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const port = 3000;
app.listen(port, () => {
  console.log('Your app is listening on port ' + port);
});