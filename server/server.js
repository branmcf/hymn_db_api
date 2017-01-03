'use strict';
var Joi = require('joi');
const Hapi = require('hapi');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123',
  database : 'testDb'
});
//mysql connection
connection.connect();
connection.query('SELECT * from users', function(err, rows, fields) {
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
});
connection.end();

//end myql connection

//quotes
var quotes = [
  {
    author: 'Audrey Hepburn'
  , text: 'Nothing is impossible, the word itself says \'I\'m possible\'!'
  }
, {
    author: 'Walt Disney'
  , text: 'You may not realize it when it happens, but a kick in the teeth may be the best thing in the world for you'
  }
, {
    author: 'Unknown'
  , text: 'Even the greatest was once a beginner. Don\'t be afraid to take that first step.'
  }
, {
    author: 'Neale Donald Walsch'
  , text: 'You are afraid to die, and you\'re afraid to live. What a way to exist.'
  }
];

//START SERVER
// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});

//
//
// Simulate an external module which is the correct way to expose this
//    kind of functionality.
//
var quoteController = {};

quoteController.getConfig = {
  handler: function(req, reply) {
    if (req.params.id) {
      if (quotes.length <= req.params.id) return reply('No quote found.').code(404);
      return reply(quotes[req.params.id]);
    }
    reply(quotes);
  }
};

quoteController.getRandomConfig = {
  handler: function(req, reply) {
    var id = Math.floor(Math.random() * quotes.length);
    reply(quotes[id]);
  }
};

quoteController.postConfig = {
  handler: function(req, reply) {
    var newQuote = { author: req.payload.author, text: req.payload.text };
    quotes.push(newQuote);
    reply(newQuote);
  },
  validate: {
    payload: {
      author: Joi.string().required(),
      text: Joi.string().required()
    }
  }
};

quoteController.deleteConfig = {
  handler: function(req, reply) {
    if (quotes.length <= req.params.id) return reply('No quote found.').code(404);
    quotes.splice(req.params.id, 1);
    reply(true);
  }
};
//end quoteController


//
// ROUTES
//
var routes = [
  { path: '/', method: 'GET', config: quoteController.getConfig },
  { path: '/quote/{id?}', method: 'GET', config: quoteController.getConfig },
  { path: '/random', method: 'GET', config: quoteController.getRandomConfig },
  { path: '/quote', method: 'POST', config: quoteController.postConfig },
  { path: '/quote/{id}', method: 'DELETE', config: quoteController.deleteConfig }
];


server.route(routes);

// Start the server
server.start((err) => {

    if (err) {
      throw err;
    }
    else {
      console.log('Server running at:', server.info.uri);
    }
});