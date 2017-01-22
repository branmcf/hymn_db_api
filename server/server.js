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

//authentication
const basic = require('hapi-auth-basic');

//const cookieAuth = require('hapi-auth-cookie');


//
// Create a server with a host and port
//
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});

/* 
===================================================
- LOGIN -
=================================================== 
*/





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

/*
//
// authentication with jwt test
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
  glob.sync('api.js', {
    root: __dirname
  }).forEach(file => {
    const route = require(path.join(__dirname, file));
    server.route(route);
  });
});
*/

/* 
===================================================
- authentication with hapi-auth-basic test -
=================================================== 
*/

/*
const testUsers = {
  john: {
    id: 357,
    email: 'John@gmail.com',
    password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm', // 'secret'
    first_name: 'john',
    last_name: 'Doe'

  }
};

const validate = function (request, first_name, password, callback) {
  const testUser = testUsers[first_name];
  if(!testUser) { 
    console.log("error, user or password incorrect...");
    return callback(null, false); 
  }

  bcrypt.compare(password, testUser.password, (err, isValid) => {
    console.log(password, " then ", testUser.password);
    callback(err, isValid, {id: testUser.id, first_name: testUser.first_name})
  });
};

server.register(require('hapi-auth-basic'), (err)=> {
  server.auth.strategy('simple', 'basic', { validateFunc: validate });
  server.route({
    method: 'GET',
    path: '/auth',
    config: {
      auth: 'simple',
      handler: function (req, reply) {
        reply('hello, '+ req.auth.credentials.first_name);
      }
    }
  });
});
*/

/* 
===================================================
- authentication method 2 with hapi-auth-basic and cookie test -
=================================================== 
*/

/*
server.register(cookieAuth, function(err) {
  server.auth.strategy('session', 'cookie', options)
  // Start the server
  server.start((err) => {

    if (err) {
      throw err;
    }
    else {
      console.log('Server running at:', server.info.uri);
    }
  });
});

server.route({
  method: 'GET',
  path: '/auth',
  config: {
    auth: 'session',
    handler: function (request, reply) {
      reply('Authentication message');
    }
  }
});
*/






var routes = require('./routes/routes.js');

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
