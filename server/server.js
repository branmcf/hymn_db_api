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
    host: options.host,
    user: options.user,
    password: options.password,
    database: options.database,
    port: options.port

});

if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL);
}

connection.connect();

// create new server instance
var server = new Hapi.Server();


// add server’s connection information
server.connection({
    port: process.env.PORT || 3000,
    routes: { cors: true }
    //protocol: 'https'
});

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
                    var JSObj = rowsToJS(rows);
                    users.push(JSObj);
                    numUsers = users[0].length;

                    if (users[0].length == 0) { return reply(Boom.unauthorized('no users register right now because tyler doesnt know how to computer')); }

                    for (var i = 0; i < users[0].length; i++) {
                        if (users[0][i].email == req.payload.email) {

                            var checkThis = Bcrypt.compareSync(req.payload.password, users[0][i].password);

                            if (checkThis == true) {
                                var returnThis = {
                                    email: users[0][i].email,
                                    first_name: users[0][i].first_name,
                                    last_name: users[0][i].last_name,
                                    website: users[0][i].website,
                                    user_id: users[0][i].id,
                                    is_admin: users[0][i].is_admin,
                                    ethnicities: users[0][i].ethnicities
                                };

                                //server.inject(`/user/${i+1}`, (res) => { return reply(res.result).code(201); });
                                returnThis.ethnicities = JSON.parse(returnThis.ethnicities);

                                return reply(returnThis).code(201);

                            } //end if password matches...
                            else {
                                return reply(Boom.unauthorized('invalid email/password'));
                            }

                        } //end matching email found
                        else if (i == users[0].length - 1) {
                            return reply(Boom.unauthorized('invalid email/password combination'));

                        }
                    } //end for loop


                } //end if statement
                else {
                    if (err) { return reply(Boom.badRequest()); }
                }

            }); //end connection.connect
            //

        }, //end handler
        validate: {
            payload: {
                email: Joi.string().email().required(),
                password: Joi.string().regex(/^[a-zA-Z0-9$^!%]{4,30}$/).required()
            }
        }


    }

});

function rowsToJS(theArray) {
    var temp = JSON.stringify(theArray);
    temp = JSON.parse(temp);
    return temp;
}


/*
===================================================
- USER Controllers -
===================================================
*/

//USER GET REQUEST
server.route({

    method: 'GET',
    path: '/user/{id?}',
    config: {

        handler: function(request, reply) {

                var toReturn = {};

                if (request.params.id) {
                    var query = connection.query(`SELECT * from users where ?`, [{ id: request.params.id }], function(err, rows, fields) {
                        if (err) { return reply(Boom.badRequest()); }
                        toReturn = rowsToJS(rows[0]); //add the [0] because we only want ONE object, not a potential array of multiple objects...

                        try {
                            toReturn["url"] = "/user/" + String(toReturn.id)
                        } catch (e) {
                            toReturn["url"] = "";
                            console.log("Error in getting user by id: ", e);
                        }
                        delete toReturn.password;

                        //var str = JSON.stringify(userData);

                        return reply(toReturn);
                    });
                } else {
                    //if no ID specified
                    var query = connection.query(`SELECT * from users`, function(err, rows, fields) {
                        if (err) { return reply(Boom.badRequest()); }
                        toReturn = rowsToJS(rows);

                        for (var i = 0; i < toReturn.length; i++) {
                            try {
                                toReturn[i]["url"] = "/user/" + String(toReturn[i].id)
                            } catch (e) {
                                toReturn[i]["url"] = "";
                                console.log("Error in getting user by id: ", e);
                            }
                            delete toReturn[i].password;
                        }

                        return reply(toReturn);
                    });

                } //end if no id...
            } //end handler
    }
});

server.register(BasicAuth, function(err) {
    if (err) { throw err; }

    //
    //
    //
    //bcrypt authentication
    const basicValidation = function(request, username, password, callback) {
            //below is hardcoded in right now, will change later
            //if(username == options.email_admin && password == options.password_admin) {
            connection.query(`SELECT * from users where email = ?`, [username], function(err, rows, fields) {
                if (err) { throw err; }

                var user = {
                    id: rows[0].id,
                    email: username,
                    password: rows[0].password,
                    is_admin: rows[0].is_admin
                };

                Bcrypt.compare(password, user.password, function(err, isValid) {
                    if (user.is_admin == true) {
                        callback(err, isValid, { id: user.id, email: user.email })
                    } else {
                        callback(err, false, { id: user.id, email: user.email })
                    }

                });
            });

            //}//end matching email and pass found 

        } //end basicValidation

    const highLevelValidation = function(request, username, password, callback) {
            connection.query(`SELECT * from users where email = ?`, [username], function(err, rows, fields) {
                if (err) { throw err; }

                var user = {
                    id: rows[0].id,
                    email: username,
                    password: rows[0].password,
                    is_admin: rows[0].is_admin
                };

                Bcrypt.compare(password, user.password, function(err, isValid) {
                    //check to see if they're an admin OR high_level user
                    if (user.is_admin == true || user.high_level == true) {
                        callback(err, isValid, { id: user.id, email: user.email })
                    } else {
                        callback(err, false, { id: user.id, email: user.email })
                    }

                });
            });

        }
        //
        //
        //
    server.auth.strategy('admin_only', 'basic', { validateFunc: basicValidation });
    server.auth.strategy('high_or_admin', 'basic', { validateFunc: highLevelValidation });


    server.route({

        method: 'POST',
        path: '/register',
        config: {
            //auth: 'admin_only',
            handler: function(req, reply) {

                connection.query(`SELECT email from users`, (err, rows) => {
                    if (err) {
                        return reply(Boom.badRequest("error selecting email from users..."));
                    } else {
                        //loop thru all emails and see if email is already in users_db
                        var emailsToCheck = rowsToJS(rows);
                        if (emailsToCheck.length !== 0) {
                            for (var i = 0; i < emailsToCheck.length; i++) {
                                if (emailsToCheck.email == req.payload.email) {
                                    return reply(Boom.badRequest('invalid query, email already exists!'));
                                }
                            }

                            //email was not found, so continue to register user
                            var salt = Bcrypt.genSaltSync(10);
                            var hash = Bcrypt.hashSync(req.payload.password, salt);

                            var theEth = JSON.stringify(req.payload.ethnicities);
                            var query = connection.query('INSERT INTO users SET ?', {
                                email: req.payload.email,
                                password: hash,
                                salt: salt,
                                iterations: 10,
                                first_name: req.payload.first_name,
                                last_name: req.payload.last_name,
                                website: req.payload.website,
                                is_admin: req.payload.is_admin,
                                ethnicities: theEth
                            }, (err, rows, fields) => {
                                if (err) {
                                    console.log("Error with registering a user...");
                                    return reply(Boom.badRequest('invalid query'));
                                }

                                return reply({
                                    email: req.payload.email,
                                    user_id: rows.insertId,
                                    first_name: req.payload.first_name,
                                    last_name: req.payload.last_name,
                                    is_admin: req.payload.is_admin,
                                    ethnicities: req.payload.ethnicities
                                }).code(201);
                            });
                        } else {
                            return reply(Boom.badRequest("no emails in the database..."));
                        }
                    }
                });

            }, //end handler
            validate: {
                payload: {
                    email: Joi.string().email().required(),
                    password: Joi.string().regex(/^[a-zA-Z0-9$^!%]{4,30}$/).required(),

                    first_name: Joi.string().alphanum(),
                    last_name: Joi.string().alphanum(),
                    website: Joi.string().hostname(),
                    is_admin: Joi.number(),
                    ethnicities: Joi.any()

                }
            }
        } //end config
    }); //end post /register

    server.route({
        method: 'PUT',
        path: '/user/{id}',
        config: {
            //auth: 'admin_only',
            handler: function(request, reply) {
                    var query = connection.query(`SELECT * from users`, function(err, rows, fields) {
                        if (err) { return reply(Boom.badRequest()); }
                        var JSObj = rowsToJS(rows);
                        users.push(JSObj);

                        if (request.params.id) {
                            //if (resources.length <= request.params.id - 1) return reply('Not enough resources in the database for your request').code(404);

                            var mysqlIndex = Number(request.params.id);

                            var theCol = request.payload.column;
                            var theVal = request.payload.value;

                            if (theCol == "password" || theCol == "salt" || theCol == "iterations" || theCol == "id") { return reply(Boom.unauthorized("cannot change the password you goofball...")); }

                            var query = connection.query(`
                UPDATE users SET ?
                WHERE ?`, [{
                                [theCol]: theVal
                            }, { id: mysqlIndex }], function(err, rows, fields) {
                                if (err) {
                                    console.log(query.sql);
                                    return reply(Boom.badRequest(`invalid query when updating resources on column ${request.payload.what_var} with value = ${request.payload.what_val} `));
                                } else {
                                    console.log(query.sql);
                                    console.log("set user #", mysqlIndex, ` variable ${theCol} = ${theVal}`);
                                }

                                return reply({ statusCode: 200 });
                            });

                            //return reply(resources[actualId]);
                        } //end if
                    });

                } //end handler
        } //end config
    });

    let routesArray = [];

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

    routes = require('./routes/all/all-routes');
    routesArray.push(routes);

    for (var i = 0; i < routesArray.length; i++) {
        server.route(routesArray[i]);
    };

    server.start(function(err) {
        if (err) {
            throw err
        }
        console.log('info', 'Server running at: ' + server.info.uri)
    });

});