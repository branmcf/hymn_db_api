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



/* 
===================================================
- Hashing -
=================================================== 
*/

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


//
// MYSQL Connection
//
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123',
  database : 'testDb'
});
//end myql connection

//
//
// Simulate an external module which is the correct way to expose this
//    kind of functionality.
//


var users = []
var resources = []
var events = []
var congs = []
var orgs = []

/* 
===================================================
- mysql -
=================================================== 
*/

connection.connect();

//get users from db
connection.query(`SELECT 
  id, 
  email, 
  first_name, 
  last_name, 
  reg_date, 
  is_active, 
  high_level, 
  city_id, 
  state_id, 
  country_id, 
  website, 
  hymn_soc_member 
  from users`, function(err, rows, fields) {

  if (!err) {
    //console.log('The solution is: ', rows);
    //console.log(rows[0].first_name, rows[0].last_name);
    //console.log(rows);
    //console.log(JSON.stringify(rows));
    //console.log(rows.rawDataPacket);
  /*
    var str = JSON.stringify(rows);
    var finalData = str.replace(/\\/g, "");
  */

    users.push(rows);

    console.log("selected users...");

  }
  else
    console.log('Error while performing Users Query.');

});

//get resources from db
connection.query(`SELECT 
        id, 
        title,
        website,
        hymn_soc_member,
        is_free,
        description,
        resource_date,
        high_level,
        city_id,
        state_id,
        country_id,
        parent_org_id
        from resources`, function(err, rows, fields) {
  if (!err) {
    //console.log('The solution is: ', rows);
    //console.log(rows[0].first_name, rows[0].last_name);
    
    //console.log("rows[0].id ", rows[0].id);
  

    //var str = JSON.stringify(rows);
    //var finalData = str.replace(/\\/g, "");

    //console.log("final data: ", finalData);


    resources.push(rows);

    //resources.push(JSON.stringify(rows));

    //resources.push(rows);
    //console.log("selected resources...");
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
    
    //events.push(rows);
/*
    var str = JSON.stringify(rows);
    var finalData = str.replace(/\\/g, "");
*/
    events.push(rows);

    console.log("selected events...");
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
    
    //congs.push(rows);
/*
    var str = JSON.stringify(rows);
    var finalData = str.replace(/\\/g, "");
*/
    congs.push(rows);

    console.log("selected congregations...");

  }
  else
    console.log('Error while performing Congregations Query.');

});

//get orgs from db
connection.query('SELECT * from organizations', function(err, rows, fields) {
  if (!err) {
    //console.log('The solution is: ', rows);
    //console.log(rows[0].first_name, rows[0].last_name);
    //console.log(rows);
    
    //events.push(rows);
/*
    var str = JSON.stringify(rows);
    var finalData = str.replace(/\\/g, "");
*/
    orgs.push(rows);

    console.log("selected events...");
  }
  else
    console.log('Error while performing Events Query.');

});

/* 
===================================================
- END mysql -
=================================================== 
*/

var userController = {};
var userController_2 = {};
var resourceController = {};
var eventController = {};
var congController = {};
var orgController = {};

/* 
===================================================
- USER Controllers -
=================================================== 
*/

//USER GET REQUEST
userController.getConfig = {
  handler: function (request, reply) {

    //don't return the salt here...
    //

    if (request.params.id) {
      //if (users.length <= request.params.id - 1) return reply('Not enough users in the database for your request').code(404);
      var actualIndex = Number(request.params.id) - 1;

      //now convert to valid JSON
      var userData = {};
      userData = {
        url:              "/users/"+ Number(request.params.id),
        id:               users[0][actualIndex].id, 
        email:            users[0][actualIndex].email,
        first_name:       users[0][actualIndex].first_name,
        hymn_soc_member:  users[0][actualIndex].hymn_soc_member,
        last_name:        users[0][actualIndex].last_name,
        is_active:        users[0][actualIndex].is_active,
        reg_date:         users[0][actualIndex].reg_date,
        high_level:       users[0][actualIndex].high_level,
        city_id:          users[0][actualIndex].city_id,
        state_id:         users[0][actualIndex].state_id,
        country_id:       users[0][actualIndex].country_id,
        website:          users[0][actualIndex].website

      };

      var str = JSON.stringify(userData);

      return reply(str);

      
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
      var actualIndex = Number(request.params.id -1 );  //if you request for resources/1 you'll get resources[0]
            
      //create new object, convert to json
      var resourceData = {};

      resourceData = {
        id:             resources[0][actualIndex].id, 
        title:          resources[0][actualIndex].title,
        url:            resources[0][actualIndex].website,
        hymn_soc_member:resources[0][actualIndex].hymn_soc_member,
        is_free:        resources[0][actualIndex].is_free,
        description:    resources[0][actualIndex].description,
        resource_date:  resources[0][actualIndex].resource_date,
        high_level:     resources[0][actualIndex].high_level,
        city_id:        resources[0][actualIndex].city_id,
        state_id:       resources[0][actualIndex].state_id,
        country_id:     resources[0][actualIndex].country_id,
        parent_org_id:  resources[0][actualIndex].parent_org_id

      };

      var theUrl = "/resource/" + String(request.params.id);

      var finalObj = {
        url: theUrl,
        data: resourceData
      };

      var str = JSON.stringify(finalObj);

      return reply(str);


      //return reply(resources[actualId]);
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
      var actualIndex = Number(request.params.id) - 1;
      //
      //create new object, convert to json
      var eventData = {};

      eventData = {
        id:             events[0][actualIndex].id, 
        title:          events[0][actualIndex].title,
        url:            events[0][actualIndex].website,
        hymn_soc_member:events[0][actualIndex].hymn_soc_member,
        frequency:      events[0][actualIndex].frequency,
        //topic:          events[0][actualIndex].topic,
        description:    events[0][actualIndex].description,
        event_date:     events[0][actualIndex].event_date,
        high_level:     events[0][actualIndex].high_level,
        city_id:        events[0][actualIndex].city_id,
        state_id:       events[0][actualIndex].state_id,
        country_id:     events[0][actualIndex].country_id,
        parent:         events[0][actualIndex].parent_org_id,
        cost:           events[0][actualIndex].cost,
        //tag_id:         events[0][actualIndex].tag_id,
        is_active:      events[0][actualIndex].is_active

      };

      var theUrl = "/event/" + String(request.params.id);

      var finalObj = {
        url: theUrl,
        data: eventData
      };

      var str = JSON.stringify(finalObj);

      return reply(str);

      //return reply(events[actualId]);
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
      //if (resources.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);      //
      var actualIndex = Number(request.params.id) - 1;
      //create new object, convert to json
      var congData = {};

      congData = {
        id:             events[0][actualIndex].id, 
        title:          events[0][actualIndex].name,
        url:            events[0][actualIndex].website,
        hymn_soc_member:events[0][actualIndex].hymn_soc_member,
        //topic:          events[0][actualIndex].topic,
        priest_attire:    events[0][actualIndex].priest_attire,
        city_id:        events[0][actualIndex].city_id,
        state_id:       events[0][actualIndex].state_id,
        country_id:     events[0][actualIndex].country_id,
        parent:         events[0][actualIndex].parent_org_id,
        cost:           events[0][actualIndex].cost,
        //tag_id:         events[0][actualIndex].tag_id,
        is_active:      events[0][actualIndex].is_active,
        desc:           events[0][actualIndex].description_of_worship_to_guests,
        size:           events[0][actualIndex].size,
        mission:        events[0][actualIndex].mission,
        is_free:        events[0][actualIndex].is_free,
        events_free:    events[0][actualIndex].events_free,
        high_level:     events[0][actualIndex].high_level

      };

      var theUrl = "/event/" + String(request.params.id);

      var finalObj = {
        url: theUrl,
        data: congData
      };

      var str = JSON.stringify(finalObj);

      return reply(str);
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
- ORGANIZATINS -
=================================================== 
*/
//CONG GET REQUEST
orgController.getConfig = {
  handler: function (request, reply) {
    if (request.params.id) {
      //if (resources.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);      //
      var actualIndex = Number(request.params.id) - 1;
      //create new object, convert to json
      var orgData = {};

      orgData = {
        id:             events[0][actualIndex].id, 
        title:          events[0][actualIndex].name,
        url:            events[0][actualIndex].website,
        //topic:          events[0][actualIndex].topic,
        priest_attire:    events[0][actualIndex].priest_attire,
        city_id:        events[0][actualIndex].city_id,
        state_id:       events[0][actualIndex].state_id,
        country_id:     events[0][actualIndex].country_id,
        parent:         events[0][actualIndex].parent_org_id,
        clothing:           events[0][actualIndex].clothing,
        //tag_id:         events[0][actualIndex].tag_id,
        is_active:      events[0][actualIndex].is_active,
        shape:           events[0][actualIndex].shape,
        attendance:           events[0][actualIndex].attendance,
        is_active:        events[0][actualIndex].is_active,
        high_level:     events[0][actualIndex].high_level

      };

      var theUrl = "/event/" + String(request.params.id);

      var finalObj = {
        url: theUrl,
        data: orgData
      };

      var str = JSON.stringify(finalObj);

      return reply(str);
    }
    //if no ID specified
    reply(orgs);
  }
};

//CONG POST REQUEST
orgController.postConfig = {
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
- AUTHENTICATION TESTING ONLY -
=================================================== 
*/
/*
var authController = {};

authController.getConfig = {
  handler: (req, res) => {

    auth= 'simple';
    reply('hello ', + request.auth.credentials.first_name);
  }
};
*/

/* 
===================================================
- ROUTES -
=================================================== 
*/
var routes = [
  { path: '/', method: 'GET', config: userController.getConfig },
  { path: '/user/{id?}', method: 'GET', config: userController.getConfig },
  { path: '/user', method: 'POST', config: userController.postConfig },
  { path: '/resource/{id?}', method: 'GET', config: resourceController.getConfig },
  { path: '/resource', method: 'POST', config: resourceController.postConfig },
  { path: '/event/{id?}', method: 'GET', config: eventController.getConfig },
  { path: '/event', method: 'POST', config: eventController.postConfig },
  { path: '/congregation/{id?}', method: 'GET', config: congController.getConfig },
  { path: '/congregation', method: 'POST', config: congController.postConfig },
  { path: '/organization/{id?}', method: 'GET', config: orgController.getConfig},
  { path: '/organization/', method: 'POST', config: orgController.postConfig}

  //{ path: '/auth', method: 'GET', config: authController.getConfig}
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
