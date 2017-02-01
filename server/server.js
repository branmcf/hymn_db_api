var Hapi = require('hapi');
var Good = require('good');
var Vision = require('vision');
//var Bcrypt = require('bcrypt')
//var Users = require('./users-db')
var Handlebars = require('handlebars');
var BasicAuth = require('hapi-auth-basic');
var CookieAuth = require('hapi-auth-cookie');

var Boom = require('boom');
var users_db = require('./users-db');

var Joi = require('joi');
var mysql = require('mysql');

//Added for login

var options = require('./config/config.js');

//mysql connection
var connection = mysql.createConnection({
  host     : options.host,
  user     : options.user,
  password : options.password,
  database : options.database,
  port     : options.port
});
if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
}

connection.connect();
//

// create new server instance
var server = new Hapi.Server();


// add server’s connection information
server.connection({
  port: process.env.PORT || 3000,
  routes: { cors: true }
  //protocol: 'https'
});

//angular error test

/*

// register plugins to server instance
server.register([ Vision, BasicAuth, CookieAuth,
  {
    register: Good,
    options: {
      ops: {
        interval: 10000
      },
      reporters: {
        console: [
          {
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [ { log: '*', response: '*', request: '*' } ]
          },
          {
            module: 'good-console'
          },
          'stdout'
        ]
      }
    }
  }
], function (err) {
  if (err) {
    server.log('error', 'failed to install plugins')

    throw err
  }

  server.log('info', 'Plugins registered')


  server.views({
    engines: {
      html: Handlebars
    },
    path: __dirname + '/views',
    layout: true
  })
  server.log('info', 'View configuration completed')

  // validation function used for hapi-auth-basic
  var basicValidation = function (request, username, password, callback) {
    var user = users_db[ username ]

    if (!user) {
      return callback(null, false)
    }

    Bcrypt.compare(password, user.password, function (err, isValid) {
      server.log('info', 'user authentication successful')
      callback(err, isValid, { id: user.id, name: user.name })
    })
  }

  server.auth.strategy('simple', 'basic', { validateFunc: basicValidation })
  server.log('info', 'Registered auth strategy: basic auth')

  // validation function used for hapi-auth-cookie: optional and checks if the user is still existing
  var cookieValidation = function (request, session, callback) {
    var username = session.username
    var user = users_db[ username ]

    if (!user) {
      return callback(null, false)
    }

    server.log('info', 'user authenticated')
    callback(err, true, user)
  }

  server.auth.strategy('session', 'cookie', {
    password: 'm!*"2/),p4:xDs%KEgVr7;e#85Ah^WYC',
    cookie: 'future-studio-hapi-tutorials-cookie-auth-example',
    redirectTo: false,
    isSecure: false,
    validateFunc: cookieValidation
  })
  server.log('info', 'Registered auth strategy: cookie auth')

  // default auth strategy avoids server crash for routes that doesn’t specify auth config
  server.auth.default('simple')

//
  var routesArray = []

  var routes = require('./routes.js')
  routesArray.push(routes)

  routes = require('./routes/congregations/congregation-routes')
  routesArray.push(routes)

  routes = require('./routes/events/event-routes')
  routesArray.push(routes)

  routes = require('./routes/organizations/organization-routes')
  routesArray.push(routes)

  routes = require('./routes/resources/resource-routes')
  routesArray.push(routes)

  routes = require('./routes/users/user-routes')
  routesArray.push(routes)

  for(var i=0; i < routesArray.length; i++) {
    server.route(routesArray[i])
  }
//


  //server.route(routes)
  server.log('info', 'Routes registered')

  // start your server after plugin registration
  server.start(function (err) {
    if (err) {
      server.log('error', 'failed to start server')
      server.log('error', err)

      throw err
    }

    server.log('info', 'Server running at: ' + server.info.uri)
  })
});
*/
// LOGIN












//

var routesArray = [];

  //var routes = require('./routes.js')
  //routesArray.push(routes)

  routes = require('./routes/congregations/congregation-routes');
  routesArray.push(routes);

  routes = require('./routes/events/event-routes');
  routesArray.push(routes);

  routes = require('./routes/organizations/organization-routes');
  routesArray.push(routes);

  routes = require('./routes/resources/resource-routes');
  routesArray.push(routes);

  routes = require('./routes/users/user-routes');
  routesArray.push(routes);

  routes = require('./routes/persons/person-routes');
  routesArray.push(routes);

  for(var i=0; i < routesArray.length; i++) {
    server.route(routesArray[i]);
  };

server.start(function (err) {
    if (err) {
      server.log('error', 'failed to start server');
      server.log('error', err);

      throw err
  };

    server.log('info', 'Server running at: ' + server.info.uri);
});






//EARLIEST VERSION:
/*

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
const Bcrypt = require('bcrypt');

//authentication
const BasicAuth = require('hapi-auth-basic');

const CookieAuth = require('hapi-auth-cookie');


//
// Create a server with a host and port
//
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});


//- BASIC AUTH -


var testUsers = {
  future: {
    id: '1',
    username: 'future',
    password: '$2a$04$YPy8WdAtWswed8b9MfKixebJkVUhEZxQCrExQaxzhcdR2xMmpSJiG'  // 'studio'
  }
};


var basicValidation = function (request, username, password, callback) {
    var user = testUsers[username]

    if(!user) { return callback(null, false)}

    Bcrypt.compare(password, user.password, function(err, isValid) {
      callback(err, isValid, {id: user.id, username: user.username })
    });


};


server.registerCookieAuth, function(err) {
    server.auth.strategy('session', 'cookie', options);

    // LOG OUT
    server.route({
      method: 'GET',
      path: '/private-route',
      config: {
            auth: 'session',
            handler: function(request, reply) {
              //clear session data
              request.cookieAuth.clear()
              reply('Logged out!')
            }
        }
    });
    // LOG OUT

    //LOGIN POST
    server.route({
      method: 'POST',
      path: '/login',
      config: {
        handler: function(request, reply) {
          var username = request.payload.username
          var password = request.payload.password

          //check if user is in DB
          //compare pass

          //if everything went smooth
          request.cookieAuth.set(user);

          reply('Yeeeeeeehaw, great to see you again!')
        }
      }
    })
    //END LOGIN POST

    //cookie test
    server.route({
      method: 'GET',
      path: '/some-route',
      config: {
        auth: {
          mode: 'try',
          strategy: 'session'
        },
        handler: function(request, reply) {
          if(request.auth.isAuthenticated) {
            //session data available
            var session = request.auth.credentials

            return reply('Bro, you\'re already authenticated!');
          }

          //if not authenticated...
        }
      }

    })
    //end cookie test

    // Start the server



};

server.start((err) => {

        if (err) {
          throw err;
        }
        else {
          console.log('Server running at:', server.info.uri);
        }
    });

*/