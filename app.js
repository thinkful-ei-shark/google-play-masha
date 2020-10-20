const express = require('express');
const morgan = require('morgan');
const playStore = require('./playstore');

const app = express();

app.use(morgan('common'));

app.get('/apps', (req, res) => {
  const {sort, genres} = req.query;
  if (!sort && !genres) return res.json(playStore);
});

app.listen(8080, () => console.log('Server on 8080'));