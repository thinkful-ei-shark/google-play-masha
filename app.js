const express = require('express');
const morgan = require('morgan');
const playStore = require('./playstore');

const app = express();

app.use(morgan('common'));

app.get('/apps', (req, res) => {
  const { sort, genres } = req.query;
  let badParams = false;
  Object.keys(req.query).forEach(q => 
    {
      if(!['sort','genres'].includes(q)) badParams = true
    })
    if(badParams) return res.status(400).json({message: 'params must be sort or genres'})
  if (!sort && !genres) return res.json(playStore);
  if (sort && !['Rating', 'App'].includes(sort)) {
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

  let data = playStore;
  if (sort) {
    data.sort((a, b) => a[sort] > b[sort] ? -1 : 1);
  }
  if (genres) {
    data = playStore.filter(game => game.Genres === genres);
  }

  return res.json(data);
});

module.exports = app;