var Hapi = require('hapi');
var Good = require('good');
var Vision = require('vision');
var Bcrypt = require('bcryptjs');
//var Users = require('./users-db')
var Handlebars = require('handlebars');
var BasicAuth = require('hapi-auth-basic');
var CookieAuth = require('hapi-auth-cookie');
const Basic = require('hapi-auth-basic');

var Boom = require('boom');
var users_db = require('./users-db');

var Joi = require('joi');
var mysql = require('mysql');

//const fs = require('fs');
//const https = require('https');



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

  //routes = require('./routes/users/user-routes');
  //routesArray.push(routes);

  routes = require('./routes/persons/person-routes');
  routesArray.push(routes);

  for(var i=0; i < routesArray.length; i++) {
    server.route(routesArray[i]);
  };


//
//
//
//
//
//
//


var userController = {};
var users = [];
  var eth = [];
  var numUsers = 0;

getUsers();

//bcrypt authentication

const validate = function (request, username, password, reply) {
    
    for(var i=0; i< users[0].length; i++) {
      console.log("trying...", users[0][i]);
      if(users[0][i].email == username ) {

        console.log("found matching user email...");


        var user = users[0][i];
        

        var checkThis = Bcrypt.compareSync(password, user.password);
           console.log(checkThis);
           if(checkThis == true) {
            var returnThis = {   
                email: user.email, 
                first_name: user.first_name,
                last_name:  user.last_name,
                city:       user.city,
                state:      user.state,
                country:    user.country,
                website:    user.website,
                user_id:    user.id 
            };
            
            server.inject(`/user/${i+1}`, (res) => { reply(res.result).code(201); });

           }//end if password matches...
           else {
             console.log("NO MATCHING PASSWORD FOUND");
             reply(Boom.unauthorized('invalid password'));
           }

      }//end matching email found
    }

    
    
};

<<<<<<< HEAD
//
// login (accepted email and password)
//
server.route({

  method: 'POST',
  path: '/login',
  config: {
    handler: function(req, reply) {

      getUsers();

      if(users[0].length==0) { return reply(Boom.unauthorized('no users register right now because tyler doesnt know how to computer')); }

      for(var i=0; i< users[0].length; i++) {
        //console.log("trying...", users[0][i]);
        if(users[0][i].email == req.payload.email ) {

          //console.log("found matching user email...");

          //var user = users[0][i];     

          var checkThis = Bcrypt.compareSync(req.payload.password, users[0][i].password);
          console.log(checkThis);
          if(checkThis == true) {
            var returnThis = {   
              email:      users[0][i].email, 
              first_name: users[0][i].first_name,
              last_name:  users[0][i].last_name,
              city:       users[0][i].city,
              state:      users[0][i].state,
              country:    users[0][i].country,
              website:    users[0][i].website,
              user_id:    users[0][i].id ,
              is_admin:   user[0][i].is_admin
            };
            
            server.inject(`/user/${i+1}`, (res) => { return reply(res.result).code(201); });

           }//end if password matches...
           else {
             console.log("NO MATCHING PASSWORD FOUND");
             reply(Boom.unauthorized('invalid password'));
           }

      }//end matching email found
    }

        

    },//end handler
    validate: {
      payload: {
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
      }
    }

    
  }

});


server.route({
  
  method: 'POST',
  path: '/register',
  config: {
    //auth: 'simple',
    handler: function(req, reply) {

      getUsers();

      var salt = Bcrypt.genSaltSync(10);
      var hash = Bcrypt.hashSync(req.payload.password, salt);

      //console.log(req.payload.password, " TURNED INTO : ", hash);
      // Store hash in your password DB. 

      //loop thru all emails and see if email is already in users_db
      for(var i=0; i< users[0].length; i++) {
        if(users[0][i].email == req.payload.email) {
          return reply(Boom.badRequest('invalid query, email already exists!')); 
        }
      }
      
      var query = connection.query('INSERT INTO users SET ?', 
      { 
        email: req.payload.email, 
        password: hash,
        salt: salt,
        iterations: 10,
        first_name: req.payload.first_name,
        last_name: req.payload.last_name,
        city: req.payload.city,
        state: req.payload.state,
        country: req.payload.country,
        website: req.payload.website,
        is_admin: req.payload.is_admin
      }, 
      function(err, rows, fields) {
          if(err) { 
            console.log("Error with registering a user...");
            return reply(Boom.badRequest('invalid query')); 
          }
          
          users[0].push({email: req.payload.email, password:hash, salt: salt, iterations: 10});
          console.log("SUCCESSFULLY ENTERED USER INTO DB\n\n", query.sql);
          return reply ({ 
            email: req.payload.email,
            user_id: users[0].length,
            first_name: req.payload.first_name,
            last_name: req.payload.last_name
          }).code(200);
      });
    //console.log("done with genSalt");
        
  },//end handler
  validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),

      first_name: Joi.string().alphanum(),
      last_name: Joi.string().alphanum(),
      city: Joi.string().alphanum(),
      state: Joi.string().alphanum(),
      country: Joi.string().alphanum(),
      website: Joi.string().hostname(),
      is_admin: Joi.number(),

    }
  }
  }//end config
});




=======
>>>>>>> cf6788bef65521e9758d7cfb79e64d35475811e0
//end authentication

function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}

//get users from db
function getUsers() {

  //console.log(">>>>>getUsers()");

  connection.query(`SELECT * from users`, function(err, rows, fields) {

      if (!err) {

        users = [];
        eth = [];
        numUsers = 0;

        //console.log(">>>>>select from db");

        var JSObj = rowsToJS(rows);

        users.push(JSObj);

        numUsers = users[0].length;



        getInter("Ethnicities", "users", "user_ethnicities", "ethnicity_id", "user_id", eth, numUsers );

        //console.log(`selected ${numUsers} users from db`);


      }//end if statement
      else
        console.log('Error while performing users Query.');

  }); //end connection.connect

  console.log("end getUsers()");

};//end get users from db

//test: Method for querying intermediate tables:
function getInter(leftTable, rightTable, middleTable, left_table_id, right_table_id, arrayToUse, numLoops ) {

    //console.log(`>>>>>getInter()`);

    for(var varI = 1; varI <= numLoops; varI++) {
        connection.query(`
          SELECT L.name
          FROM ${leftTable} L
          INNER JOIN ${middleTable} MT ON MT.${left_table_id} = L.id
          INNER JOIN ${rightTable} RT on MT.${right_table_id} = RT.id
          WHERE RT.id = ${varI}`, function(err, rows, fields) {
            if(err) {
              console.log(`ERROR IN INTERMEDIATE TABLE for leftTable: ${leftTable}, middle: ${middleTable}, right: ${rightTable}`);
              throw err;
            }

            //console.log(`>>>>>select id= ${varI} out of ${numLoops} from ${leftTable} from db`);

            var JSObj = rowsToJS(rows);

            arrayToUse.push(JSObj);

            //console.log(`done selecting ${varI} from ${leftTable}`);
        });

    }//end for loop

    //console.log(`end getInter()`);

}//end function

/*
===================================================
- USER Controllers -
===================================================
*/

function formatUser(actualIndex) {
  //console.log(`>>>>>formatUser()`);
  var userData = {};

  userData = {
    url:              "/users/" + String(actualIndex + 1),
    id:               users[0][actualIndex].id,
    email:            users[0][actualIndex].email,
    password:         users[0][actualIndex].password,
    first_name:       users[0][actualIndex].first_name,
    hymn_soc_member:  users[0][actualIndex].hymn_soc_member,
    last_name:        users[0][actualIndex].last_name,
    is_active:        users[0][actualIndex].is_active,
    reg_date:         users[0][actualIndex].reg_date,
    high_level:       users[0][actualIndex].high_level,
    city:             users[0][actualIndex].city,
    state:            users[0][actualIndex].state,
    country:          users[0][actualIndex].country,
    website:          users[0][actualIndex].website,
    approved:         users[0][actualIndex].approved,
    is_admin:         users[0][actualIndex].is_admin
    //ethnicity_name:   eth[0]

  };

  //console.log(`end getInter()`);

  return userData;
}

//USER GET REQUEST
server.route({
  
  method: 'GET',
  path: '/user/{id?}',
  config: { 
    
    handler: function (request, reply) {
      //console.log("eth[x]: ", eth[Number(request.params.id-1)]);

      getUsers();

      //console.log("\n\n======================TOTAL USERS: ", numUsers, "\n\n");

      if (request.params.id) {
        if ((numUsers <= request.params.id - 1) || (0 > request.params.id - 1)) {
          //return reply('Not enough users in the database for your request').code(404);
          return reply(Boom.notFound());
        }

        var actualIndex = Number(request.params.id) - 1;

        var userData = formatUser(actualIndex);

        //var str = JSON.stringify(userData);

        return reply(userData);


      }
      //if no ID specified
      var objToReturn = [];

      for(var i=0; i < users[0].length; i++) {
        var temp = formatUser(i);
        objToReturn.push(temp);
      }


      reply(objToReturn);
    }//end handler
  }
});


//USER POST REQUEST
server.route({
  
  method: 'POST',
  path: '/user',
  config: { 

    handler: function(req, reply) {

    //console.log("\n\n======================TOTAL USERS: ", numUsers, "\n\n");

    var newUser = {
      email: req.payload.email,
      password: req.payload.password,
      first_name: req.payload.first_name,
      last_name: req.payload.last_name,
      //salt: null,
      //high_level: req.payload.high_level,
      /*
      city_name: req.payload.city_name,
      state_name: req.payload.state_name,
      country_name: req.payload.country_name,
      website: req.payload.website,
      hymn_soc_member: req.payload.hymn_soc_member
      */
      is_active:        req.payload.is_active,
      reg_date:         req.payload.reg_date,
      high_level:       req.payload.high_level,
      city:             req.payload.city,
      state:            req.payload.state,
      country:          req.payload.country,
      website:          req.payload.website
      //ethnicity_name:   req.payload.ethnicity_name,

    };

    /*
    var returnedUser = hashAndStoreSync(newUser);

    //below line for testing
    testUser = returnedUser;

    if(returnedUser.password != undefined) {
      newUser.password = returnedUser.password;
      newUser.salt = returnedUser.salt;
      console.log("hashed pass:", newUser.password, " with salt: ", newUser.salt);
    }
    else {
      console.log("error with hash function, new password will default to \"password123\". ");
      newUser.password = "password123";
    }
    */


// mysql

    users[0].push(newUser);
    console.log(users[0]);

    //bottom necessary?
    getUsers();

    connection.query(
      'INSERT INTO users SET ?', newUser,
      function(err, rows) {

        console.log("inserted into db");


        if(err) {
          throw new Error(err);
          return;
        }

        getUsers();

        reply([{
          statusCode: 200,
          message: 'Inserted Successfully',
        }]);

      }
    )

    console.log("out of connection func...");

//end mysql

    //console.log("\n\nINSERTED!\n\n");

    //reply(newUser);



  }//end handler
  /* COMMA ^
  validate: {
    payload: {
      email:      Joi.string().email(),
      password:   Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
      first_name: Joi.string().required(),
      last_name:  Joi.string().required()
    }
  }
  */
  }//end config
});

//
//
//

server.route({
  
  method: 'POST',
  path: '/register',
  config: {
    //auth: 'simple',
    handler: function(req, reply) {

      getUsers();

      var salt = Bcrypt.genSaltSync(10);
      var hash = Bcrypt.hashSync(req.payload.password, salt);

      //console.log(req.payload.password, " TURNED INTO : ", hash);
      // Store hash in your password DB. 

      //loop thru all emails and see if email is already in users_db
      for(var i=0; i< users[0].length; i++) {
        if(users[0][i].email == req.payload.email) {
          return reply(Boom.badRequest('invalid query, email already exists!')); 
        }
      }
      
      var query = connection.query('INSERT INTO users SET ?', 
      { 
        email: req.payload.email, 
        password: hash,
        salt: salt,
        iterations: 10,
        first_name: req.payload.first_name,
        last_name: req.payload.last_name,
        city: req.payload.city,
        state: req.payload.state,
        country: req.payload.country,
        website: req.payload.website
      }, 
      function(err, rows, fields) {
          if(err) { 
            console.log("Error with registering a user...");
            return reply(Boom.badRequest('invalid query')); 
          }
          
          users[0].push({email: req.payload.email, password:hash, salt: salt, iterations: 10});
          console.log("SUCCESSFULLY ENTERED USER INTO DB\n\n");
          
          getUsers();

          return reply ({ 
            email: req.payload.email,
            user_id: users[0].length,
            first_name: req.payload.first_name,
            last_name: req.payload.last_name
          }).code(200);
      });
    //console.log("done with genSalt");
        
  },//end handler
  validate: {
    payload: {
      email: Joi.string().email().required(),
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),

      first_name: Joi.string().alphanum(),
      last_name: Joi.string().alphanum(),
      city: Joi.string().alphanum(),
      state: Joi.string().alphanum(),
      country: Joi.string().alphanum(),
      website: Joi.string().hostname()
    }
  }
  }//end config
});

//
//
//

server.route({
  
  method: 'POST',
  path: '/user/admin/{id}',
  config: { 

    handler: function(request, reply) {

      getUsers();

      if (request.params.id) {
        if ((numUsers <= request.params.id - 1) || (0 > request.params.id - 1)) {
          //return reply('Not enough users in the database for your request').code(404);
          return reply(Boom.notFound());
        }

        var theValue = {
          is_admin: request.payload.is_admin

        };

        

        var query = connection.query(
          'UPDATE users SET is_admin = ? WHERE id = ?', [theValue.is_admin, request.params.id],
          function(err, rows) {
            if(err) {
              return reply(Boom.badRequest(`Error while trying to make user with id=${request.params.id} an admin...`));
            }

            console.log(`made user with id=${request.params.id} an admin...`);

            getUsers(); //?

            reply([{
              statusCode: 200,
              message: 'Made admin Successfully',
            }]);

          }); //end mysql connection



        }//end if(req.params)
        else {
          return reply(Boom.notFound("You must specify an id as a parameter"));
        }
  
  },//end handler
  validate: {
    payload: {
      is_admin: Joi.boolean()
    }
  }
  }//end config
});

//
//
//

server.route({
  
  method: 'POST',
  path: '/user/approve/{id}',
  config: { 

    handler: function(request, reply) {

      getUsers();

      if (request.params.id) {
        if ((numUsers <= request.params.id - 1) || (0 > request.params.id - 1)) {
          //return reply('Not enough users in the database for your request').code(404);
          return reply(Boom.notFound());
        }

        var theValue = {
          approved: request.payload.approved
        };
        

        var query = connection.query(
          'UPDATE users SET approved = ? WHERE id = ?', [theValue.approved, request.params.id],
          function(err, rows) {
            if(err) {
              return reply(Boom.badRequest(`Error while trying to approve user with id=${request.params.id}...`));
            }

            console.log(`Approved user with id=${request.params.id}...`);

            getUsers();

            reply([{
              statusCode: 200,
              message: 'Approved user Successfully',
            }]);

          }); //end mysql connection



        }//end if(req.params)
        else {
          return reply(Boom.notFound("You must specify an id as a parameter"));
        }
  
  },//end handler
  validate: {
    payload: {
      approved: Joi.boolean()
    }
  }
  }//end config
});

//
//
//

server.route({
  
  method: 'POST',
  path: '/user/highlevel/{id}',
  config: { 

    handler: function(request, reply) {

      getUsers();

      if (request.params.id) {
        if ((numUsers <= request.params.id - 1) || (0 > request.params.id - 1)) {
          //return reply('Not enough users in the database for your request').code(404);
          return reply(Boom.notFound());
        }

        var theValue = {
          high_level: request.payload.high_level
        };
        

        var query = connection.query(
          'UPDATE users SET high_level = ? WHERE id = ?', [theValue.high_level, request.params.id],
          function(err, rows) {
            if(err) {
              return reply(Boom.badRequest(`Error while trying to user with id=${request.params.id} a high level user...`)); 
            }

            console.log(`Made user with id=${request.params.id} a high_level user...`);

            getUsers();

            reply([{
              statusCode: 200,
              message: 'User made high level successfully',
            }]);

          }); //end mysql connection



        }//end if(req.params)
        else {
          return reply(Boom.notFound("You must specify an id as a parameter"));
        }
  
  },//end handler
  validate: {
    payload: {
      approved: Joi.boolean()
    }
  }
  }//end config
});

//
//
//

server.route({
  method: 'DELETE',
  path: '/user/delete/{id}',
  config: {

    handler: function(request, reply) {
        getUsers();

        if (request.params.id) {
            if ((numUsers <= request.params.id - 1) || (0 > request.params.id - 1)) {
              //return reply('Not enough users in the database for your request').code(404);
              return reply(Boom.notFound("Error with users DELETE endpoint"));
            }
            //if (resources.length <= request.params.id - 1) return reply('Not enough resources in the database for your request').code(404);
            var actualIndex = Number(request.params.id -1 );  //if you request for resources/1 you'll get resources[0]

            var mysqlIndex = Number(request.params.id);

            var query = connection.query(`
            UPDATE users SET is_active = false
            WHERE id = ${mysqlIndex}`, function(err, rows, fields) {
              if(err) {
                  return reply(Boom.badRequest(`Error while trying to DELETE user with id=${request.params.id}...`));
              } else {
                  console.log("set user #", request.params.id, " to innactive (is_active = false)");
              }

              getUsers();

              reply([{
                statusCode: 200,
                message: `User with id=${request.params.id} set to innactive`,
              }]);
            });

        } else {
          return reply(Boom.notFound("You must specify an id as a parameter"));
        }
    }//end handler
  }

});

//
//
//

server.route({
  method: 'PUT',
  path: '/user/activate/{id}',
  config: {

    handler: function(request, reply) {
        getUsers();

        if (request.params.id) {
            if ((numUsers <= request.params.id - 1) || (0 > request.params.id - 1)) {
              //return reply('Not enough users in the database for your request').code(404);
              return reply(Boom.notFound("Error with users activate users endpoint"));
            }

            var query = connection.query(`
            UPDATE users SET is_active = true
            WHERE id = ${request.params.id}`, function(err, rows, fields) {
              if(err) {
                  return reply(Boom.badRequest(`Error while trying to make user active with id=${request.params.id}...`));
              } else {
                  console.log("set user #", request.params.id, " to active (is_active = true)");
              }

              reply([{
                statusCode: 200,
                message: `User with id=${request.params.id} set to ACTIVE`,
              }]);
            });

        } else {
          return reply(Boom.notFound("You must specify an id as a parameter"));
        }
    }
  }

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



server.start(function (err) {
    if (err) {
      server.log('error', 'failed to start server');
      server.log('error', err);

      throw err;
  };

    server.log('info', 'Server running at: ' + server.info.uri);
});


/*
server.register(Basic, (err) => {

    if (err) {
        throw err;
    }

    server.auth.strategy('simple', 'basic', { validateFunc: validate });
    
    //login!
    server.route({

      method: 'GET',
      path: '/login',
      config: {
        auth: 'simple',
        handler: function(req, reply) {

          getUsers();

          console.log("BEGIN LOGIN");

     
              console.log("CREDENTIALS: ", req.auth.credentials);
              return reply(req.auth.credentials);

            //}
            //else if(i+1 == users[0].length) {
              //console.log('no user in database with that email and/or password');
              //return reply(Boom.notFound('Invalid username and/or password combination'));
            //}
          //}//end for loop

        }

        
    }

    });

    server.start((err) => {

        if (err) {
            throw err;
        }

        console.log('server running at: ' + server.info.uri);
    });
});

*/