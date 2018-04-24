const express = require('express');
const cors = require('cors');
const Genre = require('./models/Genre');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// move to .env file
const SECRET_KEY = 'mysecretkey';

app.post('/oauth/token', (request, response) => {
  response.set({
    'Cache-Control': 'no-store',
    'Pragma': 'no-cache'
  });

  let { username, password, grant_type: grantType } = request.body;

  if (grantType !== 'password') {
    response.status(400).json({
      error: 'unsupported_grant_type',
      error_description: '',
      error_uri: 'https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/'
    });
  }

  if (username === 'admin' && password === '123') {
    let token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '15m' });

    // store token in database

    response.json({
      access_token: token,
      token_type: 'bearer',
    });
  }
});

app.use((request, response, next) => {
  let authorizationHeader = request.get('Authorization');

  if (!authorizationHeader) {
    return response.status(401).json({
      error: 'invalid_client'
    });
  }

  let [ tokenType, token ] = authorizationHeader.split(' ');

  if (tokenType !== 'Bearer') {
    response.status(401).json({
      error: 'invalid_client'
    });
  } else {
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (!err) {
        // verify token in database
        request.user = decoded;
        next();
      } else {
        response.status(401).json({
          error: 'invalid_client',
          // adding details for debugging
          details: err
        });
      }
    });
  }
});

app.get('/api/genres', function(request, response) {
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
