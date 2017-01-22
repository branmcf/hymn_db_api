var Hapi = require('hapi')
var Good = require('good')
var Vision = require('vision')
var Users = require('./users-db')
var Handlebars = require('handlebars')
var CookieAuth = require('hapi-auth-cookie')

// create new server instance
var server = new Hapi.Server()

// add server’s connection information
server.connection({
  host: 'localhost',
  port: 3000
})

// register plugins to server instance
server.register([
  {
    register: Vision
  },
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
  },
  {
    register: CookieAuth
  }
], function (err) {
  if (err) {
    server.log('error', 'failed to install plugins')

    throw err
  }

  server.log('info', 'Plugins registered')

  /**
   * view configuration
   */
  server.views({
    engines: {
      html: Handlebars
    },
    path: __dirname + '/views',
    layout: true
  })
  server.log('info', 'View configuration completed')

  // validation function used for hapi-auth-cookie: optional and checks if the user is still existing
  var validation = function (request, session, callback) {
    var username = session.username
    var user = Users[ username ]

    if (!user) {
      return callback(null, false)
    }

    server.log('info', 'user authenticated')
    callback(err, true, user)
  }

  server.auth.strategy('session', 'cookie', true, {
    password: 'm!*"2/),p4:xDs%KEgVr7;e#85Ah^WYC',
    cookie: 'future-studio-hapi-tutorials-cookie-auth-example',
    redirectTo: '/',
    isSecure: false,
    validateFunc: validation
  })

  server.log('info', 'Registered auth strategy: cookie auth')

  var routes = require('./cookie-routes')
  server.route(routes)
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
})


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