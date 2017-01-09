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
/*
//mysql connection
connection.connect();
connection.query('SELECT * from users', function(err, rows, fields) {
  if (!err)
    //console.log('The solution is: ', rows);
    //console.log(rows[0].first_name, rows[0].last_name);
    console.log(rows);
  else
    console.log('Error while performing Query.');

  
});
connection.end();

*/
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


var users = []
var resources = []
var events = []
var congs = []

/* 
===================================================
- mysql -
=================================================== 
*/
connection.connect();

//get users from db
connection.query('SELECT * from users', function(err, rows, fields) {
  if (!err) {
    //console.log('The solution is: ', rows);
    //console.log(rows[0].first_name, rows[0].last_name);
    //console.log(rows);
    setValue(rows);
  }
  else
    console.log('Error while performing USers Query.');

});

//get resources from db
connection.query('SELECT * from resources', function(err, rows, fields) {
  if (!err) {
    //console.log('The solution is: ', rows);
    //console.log(rows[0].first_name, rows[0].last_name);
    //console.log(rows);
    setValue(rows, resources);
  }
  else
    console.log('Error while performing Resources Query.');

});

//get events from db
connection.query('SELECT * from resources', function(err, rows, fields) {
  if (!err) {
    //console.log('The solution is: ', rows);
    //console.log(rows[0].first_name, rows[0].last_name);
    //console.log(rows);
    setValue(rows, events);
  }
  else
    console.log('Error while performing Events Query.');

});

//get congregations from db
connection.query('SELECT * from congregations', function(err, rows, fields) {
  if (!err) {
    //console.log('The solution is: ', rows);
    //console.log(rows[0].first_name, rows[0].last_name);
    //console.log(rows);
    setValue(rows, congs);
  }
  else
    console.log('Error while performing Congregations Query.');

});


connection.end();

/* 
===================================================
- END mysql -
=================================================== 
*/

//function below for console logging queries above
function setValue(value, whereToStore) {
  whereToStore = value;
  console.log(whereToStore);
}

var quoteController = {};
var userController = {};
var resourceController ={};
var eventController = {};
var congController ={};

/* 
===================================================
- Quote Controllers -
=================================================== 
*/

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

/* 
===================================================
- USER Controllers -
=================================================== 
*/

//USER GET REQUEST
userController.getConfig = {
  handler: function (request, reply) {
    if (request.params.id) {
      if (users.length <= request.params.id - 1) return reply('Not enough users in the database for your request').code(404);
      var actualId = Number(request.params.id) - 1;
      return reply(users[actualId]);
    }
    //if no ID specified
    reply(users);
  }
};


//USER POST REQUEST
userController.postConfig = {
  handler: function(req, reply) {
    var newUser = { 
      email: req.payload.email, 
      password: req.payload.password, 
      first_name: req.payload.first_name,
      last_name: req.payload.last_name
    };

    users.push(newUser);
    reply(newUser);
  },
  validate: {
    payload: {
      email: Joi.string().required(),
      password: Joi.string().required(),
      first_name: Joi.string().required(),
      last_name: Joi.string().required()
    }
  }

};

/* 
===================================================
- RESOURCE Controllers -
=================================================== 
*/

//RESOURCE GET REQUEST
resourceController.getConfig = {
  handler: function (request, reply) {
    if (request.params.id) {
      if (resources.length <= request.params.id - 1) return reply('Not enough resources in the database for your request').code(404);
      var actualId = Number(request.params.id) - 1;
      return reply(resources[actualId]);
    }
    //if no ID specified
    reply(resources);
  }
};

//RESOURCE POST REQUEST
resourceController.postConfig = {
  handler: function(req, reply) {
    var newRes = { 
      title: req.payload.title, 
      link: req.payload.link, 
      description: req.payload.description,
      is_free: req.payload.is_free
    };

    resources.push(newRes);
    reply(newRes);
  },
  validate: {
    payload: {
      title: Joi.string().required(),
      link: Joi.string().required(),
      description: Joi.string().required(),
      is_free: Joi.string().required()
    }
  }

};

/* 
===================================================
- EVENT Controllers -
=================================================== 
*/

/* 
===================================================
- CONGREGATION Controllers -
=================================================== 
*/


/* 
===================================================
- ROUTES -
=================================================== 
*/
var routes = [
  { path: '/', method: 'GET', config: quoteController.getConfig },
  { path: '/quote/{id?}', method: 'GET', config: quoteController.getConfig },
  { path: '/random', method: 'GET', config: quoteController.getRandomConfig },
  { path: '/quote', method: 'POST', config: quoteController.postConfig },
  { path: '/quote/{id}', method: 'DELETE', config: quoteController.deleteConfig },
  { path: '/user/{id?}', method: 'GET', config: userController.getConfig },
  { path: '/user', method: 'POST', config: userController.postConfig}
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