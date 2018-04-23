const express = require('express');
const app = express();
const Genre = require('./models/Genre');

app.get('/api/genres', function(request, response) {
  Genre.fetchAll().then(function(genres) {
    response.json(genres);
  });
});

app.get('/api/genres/:id', function(request, response) {
  let { id } = request.params;
  new Genre({ GenreId: id }).fetch()
    .then(function(genre) {
      if (!genre) {
        throw new Error(`Genre ${id} not found`);
      } else {
        response.json(genre);
      }
    })
    .catch(function(error) {
      response.status(404).json({
        error: error.message
      });
    });
});

const port = process.env.PORT || 8000;
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
