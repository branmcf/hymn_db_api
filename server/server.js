'use strict';
var Joi = require('joi');
const Hapi = require('hapi');
var mysql = require('mysql');
//Boom is an error library for internal error generation.
const Boom = require('boom');
const glob = require('glob');
const path = require('path');
const secret = require('./config');
//bcrypt for salting/hashing passwords
const bcrypt = require('bcrypt');
var async = require('async');

var hashDone = false;
//
// Create a server with a host and port
//
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});


//
//Bcrypt testing
//
var SALT_WORK_FACTOR = 10;
//var pass = '123456789';

function saltAndHash(pass) {

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if(err) { return console.error(err); }

    bcrypt.hash(pass, salt, function(err, hash) {
      if(err) { return console.error(err); }

      console.log(hash);

      //save new password
      var newPass = hash;

      bcrypt.compare(pass, hash, function(err, isMatch) {
        if(err) { return console.error(err); }

        console.log('do they match?', isMatch);

        return newPass;
      });

    });
  });
}

function hashAndStoreSync(user) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(user.password, salt);
  
  var returnedUser = {
    password: hash,
    salt: salt
  }

  return returnedUser;
}

function checkPassSync(user, thepass) {
 
  console.log(bcrypt.compareSync(thehash, user.password));
}

function hashAndStoreAsync(user) {
  //hash a pass
  var plaintextPass = user.password;
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(plaintextPass, salt, function(err, hash) {
      //store hash in password DB
      console.log(hash, " of type: ", typeof hash);
      if(!err) { 
        console.log("no errors, change password to the hash...");
        hashDone = true;
        return hash; 
      }
    });
  }); 
}
//
// Another hash algorithm
//
function hashAndStoreAsync2(user) {

  bcrypt.genSalt(10, function (err, salt) { 
    console.log('salt: ' + salt); 
    //
    bcrypt.hash('test', salt, function (err, crypted) {
      console.log('crypted: ' + crypted);

      bcrypt.compare('test', crypted, function(err, res) {
        console.log('compared true:' + res);
      });
    });

  });
}

//
//authentication
//
/*
const Crypto = require('crypto');
const onRequest = function (request, reply) {
  const hash = Crypto.createHash('sha1');
  request.on('peek', (chunk) => { hash.update(chunk); });
  request.once('finish', () => { console.log(hash.digest('hex')); });
  request.once('disconnect', () => { console.error('request aborted'); });
  reply reply.continue();
};

server.ext('onRequest', onRequest);
*/

//
// hashing test
//
server.register(require('hapi-auth-jwt'), (err) => {

  // We're giving the strategy both a name
  // and scheme of 'jwt'
  server.auth.strategy('jwt', 'jwt', {
    key: secret,
    verifyOptions: { algorithms: ['HS256'] }
  });

  // Look through the routes in
  // all the subdirectories of API
  // and create a new route for each
  glob.sync('api/**/routes/*.js', {
    root: __dirname
  }).forEach(file => {
    const route = require(path.join(__dirname, file));
    server.route(route);
  });
});

//
// MYSQL Connection
//
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
    //console.log(JSON.stringify(rows));
    //console.log(rows.rawDataPacket);

    addToLocalArray(users, rows);

    

    //setValue(toReturn, users);
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
    
    addToLocalArray(resources, rows);

  }
  else
    console.log('Error while performing Resources Query.');

});

//get events from db
connection.query('SELECT * from events', function(err, rows, fields) {
  if (!err) {
    //console.log('The solution is: ', rows);
    //console.log(rows[0].first_name, rows[0].last_name);
    //console.log(rows);
    addToLocalArray(events, rows);
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
    addToLocalArray(congs, rows);
  }
  else
    console.log('Error while performing Congregations Query.');

});

/* 
===================================================
- END mysql -
=================================================== 
*/

//function below for storing database content in local arrays
function addToLocalArray(localArray, theRows) {

  for (var i = 0; i < theRows.length; i++) {
    var toReturn = JSON.stringify(theRows[i]);
    localArray.push(toReturn);
  }


}

var quoteController = {};
var userController = {};
var userController_2 = {};
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
      //if (users.length <= request.params.id - 1) return reply('Not enough users in the database for your request').code(404);
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
      last_name: req.payload.last_name,
      salt: null
    };

    var returnedUser = hashAndStoreSync(newUser);
    if(returnedUser.password != undefined) {
      newUser.password = returnedUser.password;
      newUser.salt = returnedUser.salt;
      console.log("hashed pass:", newUser.password, " with salt: ", newUser.salt);
    }
    else {
      console.log("error with hash function, new password will default to \"password\". ");
      newUser.password = "password";
    }
    
    

// mysql
    //connection.connect();
    connection.query(
      'INSERT INTO users SET ?', newUser,
      function(err, rows) {
        if(err) {
          throw new Error(err);
          return;
        }

        reply([{
          statusCode: 200,
          message: 'Inserted Successfully',
        }]);
        
      }
    );
    //DELETE BELOW TO MAKE CONTINUOUS INSERTS
    //connection.end();

//end mysql

    users.push(newUser);
    //reply(newUser);

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
      //if (resources.length <= request.params.id - 1) return reply('Not enough resources in the database for your request').code(404);
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

    // mysql
    //connection.connect();
    connection.query(
      'INSERT INTO resources SET ?', newRes,
      function(err, rows) {
        if(err) {
          throw new Error(err);
          return;
        }

        reply([{
          statusCode: 200,
          message: 'Inserted Successfully',
        }]);
        
      }
    );
    //end mysql

    resources.push(newRes);
    //reply(newRes);
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

//EVENT GET REQUEST
eventController.getConfig = {
  handler: function (request, reply) {
    if (request.params.id) {
      //if (resources.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);
      var actualId = Number(request.params.id) - 1;
      return reply(events[actualId]);
    }
    //if no ID specified
    reply(events);
  }
};

//EVENT POST REQUEST
eventController.postConfig = {
  handler: function(req, reply) {
    var newEvent = { 
      event_title: req.payload.event_title, 
      website: req.payload.website, 
      event_desc: req.payload.event_desc,
      theme_or_topic: req.payload.theme_or_topic
    };

    // mysql
    //connection.connect();
    connection.query(
      'INSERT INTO event_table SET ?', newEvent,
      function(err, rows) {
        if(err) {
          throw new Error(err);
          return;
        }

        reply([{
          statusCode: 200,
          message: 'Inserted Successfully',
        }]);
        
      }
    );
    //end mysql

    events.push(newEvent);
    //reply(newRes);
  },
  validate: {
    payload: {
      event_title: Joi.string().required(),
      website: Joi.string().required(),
      event_desc: Joi.string().required(),
      theme_or_topic: Joi.string().required()
    }
  }

};

/* 
===================================================
- CONGREGATION Controllers -
=================================================== 
*/

//CONG GET REQUEST
congController.getConfig = {
  handler: function (request, reply) {
    if (request.params.id) {
      //if (resources.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);
      var actualId = Number(request.params.id) - 1;
      return reply(congs[actualId]);
    }
    //if no ID specified
    reply(congs);
  }
};

//CONG POST REQUEST
congController.postConfig = {
  handler: function(req, reply) {
    var newCong = { 
      cong_name: req.payload.cong_name, 
      website: req.payload.website, 
      cong_city: req.payload.cong_city,
      cong_state: req.payload.cong_state,
      cong_country: req.payload.cong_country,
      priest_attire: req.payload.priest_attire,
      denomination_id: req.payload.denomination_id,
      song_types_id: req.payload.song_types_id,
      instrument_types_id: req.payload.instrument_types_id,
      worship_types_id: req.payload.worship_types_id,
      ethnicity_types_id: req.payload.ethnicity_types_id,
      cong_type_id: req.payload.cong_type_id
    };

    // mysql
    //connection.connect();
    connection.query(
      'INSERT INTO congregations SET ?', newCong,
      function(err, rows) {
        if(err) {
          throw new Error(err);
          return;
        }

        reply([{
          statusCode: 200,
          message: 'Inserted Successfully',
        }]);
        
      }
    );
    //end mysql

    congs.push(newCong);
    //reply(newRes);
  },
  validate: {
    payload: {
      cong_name: Joi.string().required(),
      website: Joi.string().required(),
      cong_city: Joi.string().required(),
      cong_state: Joi.string().required(),
      cong_country: Joi.string().required(),
      priest_attire: Joi.string().required(),
      denomination_id: Joi.number().required(),
      song_types_id: Joi.number().required(),
      instrument_types_id: Joi.number().required(),
      worship_types_id: Joi.number().required(),
      ethnicity_types_id: Joi.number().required(),
      cong_type_id: Joi.number().required()

    }
  }

};

/* 
===================================================
- TESTING SALTING -
=================================================== 
*/
//USER GET REQUEST
userController_2.getConfig = {
  handler: (req, res) => {
    reply("hello");   
  }
  
};


//USER POST REQUEST
userController_2.postConfig = {
  handler: (req, res) => {
    reply("hello");   
  }
};

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
  { path: '/user', method: 'POST', config: userController.postConfig },
  { path: '/resource/{id?}', method: 'GET', config: resourceController.getConfig },
  { path: '/resource', method: 'POST', config: resourceController.postConfig },
  { path: '/event/{id?}', method: 'GET', config: eventController.getConfig },
  { path: '/event', method: 'POST', config: eventController.postConfig },
  { path: '/cong/{id?}', method: 'GET', config: congController.getConfig },
  { path: '/cong', method: 'POST', config: congController.postConfig },
  { path: '/api/user/{id?}', method: 'GET', config: userController_2.postConfig },
  { path: '/api/user', method: 'POST', config: userController_2.postConfig }
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