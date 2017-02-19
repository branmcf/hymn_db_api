var Hapi = require('hapi');
var Bcrypt = require('bcryptjs');
var Boom = require('boom');
var Joi = require('joi');
var mysql = require('mysql');
var async = require('async');

const fs = require('fs');
//const https = require('https');
var BasicAuth = require('hapi-auth-basic')

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

getUsersNew();
//

// create new server instance
var server = new Hapi.Server();


// add server’s connection information
server.connection({
  port: process.env.PORT || 3000,
  routes: { cors: true }
  //protocol: 'https'
});

var routesArray = [];

  //var routes = require('./routes.js')
  //routesArray.push(routes)
  routes = require('./routes/resources/resource-routes');
  routesArray.push(routes);
  

  routes = require('./routes/events/event-routes');
  routesArray.push(routes);
  

  routes = require('./routes/persons/person-routes');
  routesArray.push(routes);
  

  routes = require('./routes/organizations/organization-routes');
  routesArray.push(routes);

  routes = require('./routes/congregations/congregation-routes');
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
  var numUsers = 0;

function getUsersNew() {

  var query = connection.query(`SELECT * from users`, function(err, rows, fields) {
    var JSObj = rowsToJS(rows);
    users.push(JSObj);
    numUsers = users[0].length;
    console.log("done with getUsersNew");

  });
};//end getUsersNew



//
// login (accepted email and password)
//
server.route({

  method: 'POST',
  path: '/login',
  config: {
    handler: function(req, reply) {

      connection.query(`SELECT * from users`, function(err, rows, fields) {
        if (!err) {
          users = [];
          numUsers = 0;
          //console.log(">>>>>select from db");
          var JSObj = rowsToJS(rows);
          users.push(JSObj);
          numUsers = users[0].length;

          if(users[0].length==0) { return reply(Boom.unauthorized('no users register right now because tyler doesnt know how to computer')); }

          //console.log("length: ", users[0].length);
          for(var i=0; i< users[0].length; i++) {
            //console.log("trying...", users[0][i]);
            if(users[0][i].email == req.payload.email ) {
              
              //console.log("found matching user email...");

              //var user = users[0][i];     

              var checkThis = Bcrypt.compareSync(req.payload.password, users[0][i].password);
              //console.log(checkThis);

              if(checkThis == true) {
                var returnThis = {   
                  email:      users[0][i].email, 
                  first_name: users[0][i].first_name,
                  last_name:  users[0][i].last_name,
                  website:    users[0][i].website,
                  user_id:    users[0][i].id,
                  is_admin:   users[0][i].is_admin,
                  ethnicities:users[0][i].ethnicities
                };
                
                //server.inject(`/user/${i+1}`, (res) => { return reply(res.result).code(201); });
                returnThis.ethnicities = JSON.parse(returnThis.ethnicities);

                console.log("successfull login");
                return reply(returnThis).code(201);

              }//end if password matches...
              else {
                console.log("NO MATCHING PASSWORD FOUND");
                return reply(Boom.unauthorized('invalid email/password'));
              }

            }//end matching email found
            else if( i == users[0].length - 1){
              console.log("invalid email...");
              return reply(Boom.unauthorized('invalid email/password combination'));

            }
          }//end for loop
          

        }//end if statement
        else
          console.log('Error while performing users Query.');

      }); //end connection.connect



//

    

        

    },//end handler
    validate: {
      payload: {
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
      }
    }

    
  }

});
function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}


/*
===================================================
- USER Controllers -
===================================================
*/

function formatUser(actualIndex) {
  //console.log(`>>>>>formatUser()`);
  var userData = {};

  userData = {
    url:              "/user/" + String(actualIndex + 1),
    id:               users[0][actualIndex].id,
    email:            users[0][actualIndex].email,
    password:         users[0][actualIndex].password,
    first_name:       users[0][actualIndex].first_name,
    hymn_soc_member:  users[0][actualIndex].hymn_soc_member,
    last_name:        users[0][actualIndex].last_name,
    is_active:        users[0][actualIndex].is_active,
    reg_date:         users[0][actualIndex].reg_date,
    high_level:       users[0][actualIndex].high_level,
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

      getUsersNew();

      //console.log("\n\n======================TOTAL USERS: ", numUsers, "\n\n");

      if (request.params.id) {
        if ((numUsers <= request.params.id - 1) || (0 > request.params.id - 1)) {
          //return reply('Not enough users in the database for your request').code(404);
          return reply(Boom.notFound());
        }

        var actualIndex = Number(request.params.id) - 1;

        var userData = formatUser(actualIndex);
        delete userData.password;

        //var str = JSON.stringify(userData);

        return reply(userData);


      }
      //if no ID specified
      var objToReturn = [];

      for(var i=0; i < users[0].length; i++) {
        var temp = formatUser(i);
        delete temp.password;
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
      website:          req.payload.website,
      ethnicities:      req.payload.ethnicities

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
    getUsersNew();

    connection.query(
      'INSERT INTO users SET ?', newUser,
      function(err, rows) {

        console.log("inserted into db");


        if(err) {
          throw new Error(err);
          return;
        }

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
  path: '/user/admin/{id}',
  config: { 

    handler: function(request, reply) {

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

/*
server.start(function (err) {
    if (err) {
      server.log('error', 'failed to start server');
      server.log('error', err);

      throw err;
  };

    server.log('info', 'Server running at: ' + server.info.uri);
});
*/

server.register(BasicAuth, function (err) {  
  if(err) { throw err; }

  //
  //
  //
  //bcrypt authentication
  const basicValidation = function (request, username, password, callback) {
      //below is hardcoded in right now, will change later
      //if(username == options.email_admin && password == options.password_admin) {
      connection.query(`SELECT * from users where email = ?`, [username], function(err, rows, fields) {
        if(err) { throw err;}
        console.log("rows: ", rows);
        
        var user = {
          id: rows[0].id,
          email: username,
          password: rows[0].password
        };
        
        Bcrypt.compare(password, user.password, function (err, isValid) {
          callback(err, isValid, { id: user.id, email: user.email })
        });
      });  

      //}//end matching email and pass found 

  }//end basicValidation
  //
  //
  //
  server.auth.strategy('simple', 'basic', { validateFunc: basicValidation })

  server.route({
    
    method: 'POST',
    path: '/register',
    config: {
      auth: 'simple',
      handler: function(req, reply) {

        async.series([
          function(callback) {
            var query = connection.query(`SELECT * from users`, function(err, rows, fields) {
              var JSObj = rowsToJS(rows);
              users.push(JSObj);
              numUsers = users[0].length;
              console.log("done with getUsersNew");

              callback(null, 'one');
            });
            
          },
          function(callback) {
  //

            var salt = Bcrypt.genSaltSync(10);
            var hash = Bcrypt.hashSync(req.payload.password, salt);

            //console.log(req.payload.password, " TURNED INTO : ", hash);
            // Store hash in your password DB. 

            //loop thru all emails and see if email is already in users_db
            if(users.length !== 0) {
              //console.log(users);
              for(var i=0; i< users[0].length; i++) {
                if(users[0][i].email == req.payload.email) {
                  return reply(Boom.badRequest('invalid query, email already exists!')); 
                }
              }
            }
            
            //console.log("ethnicities: ", req.payload.ethnicities);
            var theEth = JSON.stringify(req.payload.ethnicities);
            //console.log("theEth: ", theEth);
            var query = connection.query('INSERT INTO users SET ?', 
            { 
              email: req.payload.email, 
              password: hash,
              salt: salt,
              iterations: 10,
              first_name: req.payload.first_name,
              last_name: req.payload.last_name,
              website: req.payload.website,
              is_admin: req.payload.is_admin,
              ethnicities: theEth
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
                  last_name: req.payload.last_name,
                  is_admin: req.payload.is_admin,
                  ethnicities: req.payload.ethnicities
                }).code(201);
            });
            

  //
            callback(null, 'two');
          }

        ], function(err, results) {
          console.log("done with both");
        });

        
        

        
          
    },//end handler
    validate: {
      payload: {
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),

        first_name: Joi.string().alphanum(),
        last_name: Joi.string().alphanum(),
        website: Joi.string().hostname(),
        is_admin: Joi.number(),
        ethnicities: Joi.any()

      }
    }
    }//end config
  });

  // start your server after plugin registration
  server.start(function (err) {
    if (err) {
      throw err
    }

    console.log('info', 'Server running at: ' + server.info.uri)
  })

});