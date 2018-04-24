const express = require('express');
const cors = require('cors');
const Genre = require('./models/Genre');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/api/genres', function(request, response) {
  console.log('user', request.user);
  Genre.fetchAll().then((genres) => {
    response.json(genres);
  });
});

app.get('/api/genres/:id', function(request, response) {
  let { id } = request.params;
  new Genre({ GenreId: id }).fetch()
    .then((genre) => {
      if (!genre) {
        throw new Error(`Genre ${id} not found`);
      } else {
        response.json(genre);
      }
    })
    .catch((error) => {
      response.status(404).json({
        error: error.message
      });
    });
});

app.post('/api/genres', function(request, response) {
  let name = request.body.name;
  new Genre({ Name: name }).save()
    .then((genre) => {
      response.json(genre);
    });
});

app.listen(process.env.PORT || 8000);
