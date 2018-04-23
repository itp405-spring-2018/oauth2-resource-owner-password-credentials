const knex = require('knex');
const bookshelf = require('bookshelf');

function connect() {
  return knex({
    client: 'sqlite3',
    connection: {
      filename: `${__dirname}/database.sqlite`
    }
  });
}

module.exports = bookshelf(connect());
