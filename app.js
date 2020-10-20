const express = require('express');
const morgan = require('morgan');
const playStore = require('./playstore');

const app = express();

app.use(morgan('common'));

app.get('/apps', (req, res) => {
  const { sort, genres } = req.query;
  if (!sort && !genres) return res.json(playStore);
  if (sort && !['rating', 'app'].includes(sort)) {
    return res
      .status(400)
      .json({ message: 'sort must be on of "rating" or "app"' });
  }
  if (genres &&
    !['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card']
      .includes(genres)) {
    return res
      .status(400)
      .json({ message: 'genres must be one of "Action", "Puzzle", "Strategy", "Casual", "Arcade", or "Card"' });
  }
});

app.listen(8080, () => console.log('Server on 8080'));