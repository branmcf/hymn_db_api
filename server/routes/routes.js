var Joi = require('Joi');
var mysql = require('mysql');
const Boom = require('boom');
const bcrypt = require('bcrypt');

/* 
===================================================
- Hashing -
=================================================== 
*/

//testing:
var testUser = {};


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

/*
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
*/

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


/* 
===================================================
- mysql connection -
=================================================== 
*/
var connection = mysql.createConnection({
  host     : 'localhost',
<<<<<<< HEAD
  user     : options.user,
  password : options.password,
  database : options.database
});
if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
}
//end myql connection
=======
  user     : 'root',
  password : '123',
  database : 'testDb'
});
//end myql connection
if (process.env.CLEARDB_DATABASE_URL) {
  connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
}
>>>>>>> f757ceeb64d14b5384e8d2633e729b3089fb333f

//
//
// Simulate an external module which is the correct way to expose this
//    kind of functionality.
//

var users = [];
var eth = [];
var numUsers = 0;

var resources = [];
  var numRes = 0;
  var resTypes = [];
  var resTopics =[];
  var resAcc = [];
  var resTags = [];
  var resEth = [];

var events = [];
  var numEvents = 0;
  var eventTypes = [];
  var eventTags = [];

var congs = [];
  var numCongs = 0;
  var congDen = [];
  var congCategories = [];
  var congInstr = [];
  var congEth = [];
  var congTags = [];

var orgs = [];
  var numOrgs = 0;
  var orgDen = [];
  var orgTags = [];
  var orgSongTypes = [];
  var orgInstr = [];
  var orgWorshipTypes = [];
  var orgEth = [];
  var orgCongs = [];

//test: Method for querying intermediate tables:
function getInter(leftTable, rightTable, middleTable, left_table_id, right_table_id, arrayToUse, numLoops ) {

    for(var varI = 1; varI <= numLoops; varI++) {
        connection.query(`
          SELECT L.name
          FROM ${leftTable} L
          INNER JOIN ${middleTable} MT ON MT.${left_table_id} = L.id
          INNER JOIN ${rightTable} RT on MT.${right_table_id} = RT.id
          WHERE RT.id = ${varI}`, function(err, rows, fields) {
            if(err) { throw err; }
            
            var JSObj = rowsToJS(rows);
            
            arrayToUse.push(JSObj);

          
        });
        
    }//end for loop
}//end function

/* 
===================================================
- mysql -
=================================================== 
*/

connection.connect();

getUsers();
getResources();
getEvents();
getCongregations();
getOrganizations();

//get users from db
function getUsers() {

  console.log("aaa_1");

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
        
        var JSObj = rowsToJS(rows);

        users.push(JSObj);

        numUsers = users[0].length;

        //now for ethnicities
        /*
        for(var varI = 1; varI <= numUsers; varI++) {
          connection.query(`
            SELECT e.name
            FROM Ethnicities e
            INNER JOIN user_ethnicities ue ON ue.ethnicity_id = e.id
            INNER JOIN users u on ue.user_id = u.id
            WHERE u.id = ${varI}`, function(err, rows, fields) {
              if(err) { throw err; }
              
              var JSObj = rowsToJS(rows);
              
              eth.push(JSObj);

            
          });
          
        }//end for loop
        */

        //getInter("Ethnicities", "Users", "user_ethnicities", "ethnicity_id", "user_id", eth, numUsers );
        
        console.log(`selected ${numUsers} users...`);
        

      }//end if statement
      else
        console.log('Error while performing Users Query.');

  }); //end connection.connect

};


//console.log(users[0].length);

function getResources() {
  //get RESOURCES from db
  connection.query(`SELECT 
          id, 
          title,
          website,
          resource_date,
          description,
          is_active,
          high_level,
          city_id,
          state_id,
          country_id,
          hymn_soc_member,        
          parent_org_id,
          is_free
          from resources`, function(err, rows, fields) {
            //need type, topics, accompaniment, tags, ethnicities
    if (!err) {

      var JSObj = rowsToJS(rows);       
      
      resources.push(JSObj);

      numRes = resources[0].length;

/* 
===================================================
- RESOURCE TYPES -
=================================================== 
*/
/*
        for(var varI = 1; varI <= numUsers; varI++) {
          connection.query(`
            SELECT rt.name
            FROM Resource_Types rt
            INNER JOIN resource_resource_types rrt ON rrt.resource_type_id = rt.id
            INNER JOIN resources r on rrt.resource_id = r.id
            WHERE r.id = ${varI}`, function(err, rows, fields) {
              if(err) { throw err; }

              //console.log("now: ", rows);
              
              var JSObj = rowsToJS(rows);
              
              resTypes.push(JSObj);

            
          });
          
        }//end for loop
*/

    getInter("Resource_Types",  "resources", "resource_resource_types", "resource_type_id", "resource_id", resTypes, numRes);
    getInter("Topics",          "resources", "resource_topics",         "topic_id", "resource_id", resTopics, numRes);
    getInter("Tags",            "resources", "resource_tags",           "tag_id", "resource_id", resTags, numRes);
    getInter("Ethnicities",     "resources", "resource_ethnicities",    "ethnicity_id", "resource_id", resEth, numRes);

/* 
===================================================
- RESOURCE Topics -
=================================================== 
*/
/*
    //getResourceTopics();
    for(var varI = 1; varI <= numUsers; varI++) {
          connection.query(`
            SELECT rt.name
            FROM Topics rt
            INNER JOIN resource_topics rrt ON rrt.topic_id = rt.id
            INNER JOIN resources r on rrt.resource_id = r.id
            WHERE r.id = ${varI}`, function(err, rows, fields) {
              if(err) { throw err; }

              //console.log("now: ", rows);
              
              var JSObj = rowsToJS(rows);
              
              resTopics.push(JSObj);

            
          });
    }
    */
      
    }
    else
      console.log('Error while performing Resources Query.');

  });
}

function getEvents() {
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
      var JSObj = rowsToJS(rows);       
      events.push(JSObj);

      numEvents = events[0].length;

      getInter("Event_Types", "events", "event_event_types", "event_type_id", "event_id", eventTypes, numEvents );
      getInter("Tags", "events", "event_tags", "tag_id", "event_id", eventTags, numEvents );
      
    }
    else
      console.log('Error while performing Events Query.');

  });
}

function getCongregations() {
  //get congregations from db
  connection.query('SELECT * from congregations', function(err, rows, fields) {
    if (!err) {
    
      var JSObj = rowsToJS(rows);       
      congs.push(JSObj);
      numCongs = congs[0].length;

      getInter("Denominations", "congregations", "congregation_denominations", "denomination_id", "congregation_id", congDen, numCongs);
      getInter("Cong_Types",    "congregations",   "congregation_types" ,"congregation_type_id", "congregation_id", congCategories, numCongs);
      getInter("Instrument_Types", "congregations", "congregation_instrument_types", "instrument_type_id", "congregation_id", congInstr, numCongs);
      getInter("Ethnicities",  "congregations", "congregation_ethnicities",  "ethnicity_id", "congregation_id", congEth, numCongs);
      getInter("Tags", "congregations", "congregation_tags", "tag_id", "congregation_id", congTags, numCongs);



    }
    else
      console.log('Error while performing Congregations Query.');

  });
}

function getOrganizations() {
  //get orgs from db
  connection.query('SELECT * from organizations', function(err, rows, fields) {
    if (!err) {
      
      
      var JSObj = rowsToJS(rows);       
      orgs.push(JSObj);

      numOrgs = orgs[0].length;

      getInter("Denominations", "organizations", "organization_denominations", "denomination_id", "organization_id", orgDen, numOrgs);
      getInter("Tags", "organizations", "organization_tags", "tag_id", "organization_id", orgTags, numOrgs);
      //song types
      getInter("Song_Types", "organizations", "organization_song_types", "song_type_id", "organization_id", orgSongTypes, numOrgs);
      //instrument types
      getInter("Instrument_Types", "organizations", "organization_instrument_types", "instrument_type_id", "organization_id", orgInstr, numOrgs);
      //worship types
      //ethnicities
      getInter("Ethnicities", "organizations", "organization_ethnicities", "ethnicity_id", "organization_id", orgEth, numOrgs);
      //congregations
      getInter("congregations", "organizations", "organization_congregations", "congregation_id", "organization_id", orgCongs, numOrgs);

    }
    else
      console.log('Error while performing Events Query.');

  });
}
/* 
===================================================
- END MYSQL -
=================================================== 
*/

function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}

var userController = {};
var resourceController = {};
var eventController = {};
var congController = {};
var orgController = {};

/* 
===================================================
- USER Controllers -
=================================================== 
*/

function formatUser(actualIndex) {
  var userData = {};

  userData = {
    url:              "/users/" + String(actualIndex + 1),
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
    website:          users[0][actualIndex].website,
    ethnicity_name:   eth[0]

  };

  console.log(userData);

  return userData;
}

//USER GET REQUEST
userController.getConfig = {
  handler: function (request, reply) {
    //console.log("eth[x]: ", eth[Number(request.params.id-1)]);

    getUsers();

    if (request.params.id) {
      //if (users.length <= request.params.id - 1) return reply('Not enough users in the database for your request').code(404);
      var actualIndex = Number(request.params.id) - 1;

      var userData = formatUser(actualIndex);

      //var str = JSON.stringify(userData);

      return reply(userData);

      
    }
    //if no ID specified
    var objToReturn = [];

    for(var i=0; i < users[0].length; i++) {
      var bob = formatUser(i);
      objToReturn.push(bob);
    }

    
    reply(objToReturn);
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
      salt: null,
      high_level: req.payload.high_level,
      /*
      city_name: req.payload.city_name,
      state_name: req.payload.state_name,
      country_name: req.payload.country_name,
      website: req.payload.website,
      hymn_soc_member: req.payload.hymn_soc_member
      */
    };

    var returnedUser = hashAndStoreSync(newUser);

    //below line for testing
    testUser = returnedUser;

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

function formatResource(actualIndex) {
  var resourceData = {};
  
  resourceData = {
    id:             resources[0][actualIndex].id, 
    title:          resources[0][actualIndex].title,
    //type(s)
    types:          resTypes[actualIndex],
    url:            resources[0][actualIndex].website,
    resource_date:  resources[0][actualIndex].resource_date,
    description:    resources[0][actualIndex].description,
    parent_org_id:  resources[0][actualIndex].parent_org_id,
    //topics
    topics:         resTopics[actualIndex],
    //accompaniment (????????)
    //tags
    tags:           resTags[actualIndex],
    is_active:      resources[0][actualIndex].is_active,
    high_level:     resources[0][actualIndex].high_level,
    city_id:        resources[0][actualIndex].city_id,
    state_id:       resources[0][actualIndex].state_id,
    country_id:     resources[0][actualIndex].country_id,
    hymn_soc_member:resources[0][actualIndex].hymn_soc_member,
    //ethnicities
    ethnicities:    resEth[actualIndex],
    //eth id
    is_free:        resources[0][actualIndex].is_free

  };

  var theUrl = "/resource/" + String(actualIndex+1);

  var finalObj = {
    url: theUrl,
    data: resourceData
  };

  //var str = JSON.stringify(finalObj);

  return finalObj;


}

//RESOURCE GET REQUEST
resourceController.getConfig = {

  

  handler: function (request, reply) {

    getResources();

    if (request.params.id) {
      //if (resources.length <= request.params.id - 1) return reply('Not enough resources in the database for your request').code(404);
      var actualIndex = Number(request.params.id -1 );  //if you request for resources/1 you'll get resources[0]
            
      //create new object, convert to json
      var str = formatResource(actualIndex);
      

  
      return reply(str);


      //return reply(resources[actualId]);
    }
    //
    //if no ID specified
    //

    //reply(JSON.stringify(resources[0]));
      
    var objToReturn = [];

    for(var i=0; i < resources[0].length; i++) {
      var bob = formatResource(i);
      objToReturn.push(bob);
    }

    console.log(objToReturn);
    
    reply(objToReturn);
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

function formatEvent(actualIndex) {
  var eventData = {};

  eventData = {
    id:             events[0][actualIndex].id, 
    title:          events[0][actualIndex].title,
    frequency:      events[0][actualIndex].frequency,
    url:            events[0][actualIndex].website,
    parent:         events[0][actualIndex].parent_org_id,
    //topic(s)
    topics:         eventTypes[actualIndex],
    description:    events[0][actualIndex].description,
    event_date:     events[0][actualIndex].event_date,
    cost:           events[0][actualIndex].cost,
    //tag id's
    tags:           eventTags[actualIndex],
    city_id:        events[0][actualIndex].city_id,
    state_id:       events[0][actualIndex].state_id,
    country_id:     events[0][actualIndex].country_id,
    hymn_soc_member:events[0][actualIndex].hymn_soc_member,    
    is_active:      events[0][actualIndex].is_active,
    high_level:     events[0][actualIndex].high_level


  };

  var theUrl = "/event/" + Number(actualIndex+1);

  var finalObj = {
    url: theUrl,
    data: eventData
  };

  return finalObj;
}

//EVENT GET REQUEST
eventController.getConfig = {
  handler: function (request, reply) {
    if (request.params.id) {
      //if (resources.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);
      var actualIndex = Number(request.params.id) - 1;
      //
      //create new object, convert to json
      var finalObj = formatEvent(actualIndex);

      return reply(finalObj);

      //return reply(events[actualId]);
    }
    //if no ID specified
    //reply(JSON.stringify(events[0]));

    var objToReturn = [];

    for(var i=0; i < events[0].length; i++) {
      var bob = formatEvent(i);
      objToReturn.push(bob);
    }
    
    reply(objToReturn);
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

function formatCongregation(actualIndex) {
  var congData = {};

  congData = {
    id:             congs[0][actualIndex].id, 
    name:          congs[0][actualIndex].name,
    url:            congs[0][actualIndex].website,
    //denominations
    denominations:  congDen[actualIndex],
    city_id:        congs[0][actualIndex].city_id,
    state_id:       congs[0][actualIndex].state_id,
    country_id:     congs[0][actualIndex].country_id,
    hymn_soc_member:congs[0][actualIndex].hymn_soc_member,
    //categories
    categories:     congCategories[actualIndex],
    //instruments
    instruments:    congInstr[actualIndex],
    shape:          congs[0][actualIndex].shape,
    clothing:       congs[0][actualIndex].clothing,
    geography:      congs[0][actualIndex].geographic_area,
    //ethnicities
    ethnicities:    congEth[actualIndex],
    //tags
    tags:           congCategories[actualIndex],
    is_active:      congs[0][actualIndex].is_active,
    high_level:     congs[0][actualIndex].high_level

  };

  var theUrl = "/congregation/" + String(actualIndex+1);

  var finalObj = {
    url: theUrl,
    data: congData
  };

  return finalObj;
}

//CONG GET REQUEST
congController.getConfig = {
  handler: function (request, reply) {
    if (request.params.id) {
      //if (resources.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);      //
      var actualIndex = Number(request.params.id) - 1;
      //create new object, convert to json
      var finalObj = formatCongregation(actualIndex);

      console.log("eyy: ", finalObj);

      return reply(finalObj);
    }
    //if no ID specified
    //reply(JSON.stringify(congs[0]));

    var objToReturn = [];

    for(var i=0; i < congs[0].length; i++) {
      var bob = formatCongregation(i);
      objToReturn.push(bob);
    }
    
    reply(objToReturn);
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

function formatOrg(actualIndex) {
  var orgData = {};

  orgData = {
    id:             orgs[0][actualIndex].id, 
    name:          orgs[0][actualIndex].name,
    url:            orgs[0][actualIndex].website,
    parent:         orgs[0][actualIndex].parent_org_id,
    //denomination(s)   
    denomination:   orgDen[actualIndex],      
    city_id:        orgs[0][actualIndex].city_id,
    state_id:       orgs[0][actualIndex].state_id,
    country_id:     orgs[0][actualIndex].country_id,
    geographic_area:orgs[0][actualIndex].geography,
    is_org_free:    orgs[0][actualIndex].is_free,
    events_free:    orgs[0][actualIndex].offers_free_events,
    membership_free:orgs[0][actualIndex].membership_free,
    mission:        orgs[0][actualIndex].mission,   
    process:        orgs[0][actualIndex].the_process,
    //tags
    tags:           orgTags[actualIndex],
    hymn_soc_member:orgs[0][actualIndex].hymn_soc_member,
    is_active:      orgs[0][actualIndex].is_active,  
    high_level:     orgs[0][actualIndex].high_level,
    //song types
    song_types:     orgSongTypes[actualIndex],  
    //instrument types
    instrument_types:orgInstr[actualIndex],
    //worship types
    worship_types:  orgWorshipTypes[actualIndex],
    //ethnicities
    ethnicities:   orgEth[actualIndex],
    //congregations
    congregations:  orgCongs[actualIndex]
    

  };

  var theUrl = "/organization/" + String(actualIndex+1);

  var finalObj = {
    url: theUrl,
    data: orgData
  };

  //var str = JSON.stringify(finalObj);

  return finalObj;
}

//ORG GET REQUEST
orgController.getConfig = {
  handler: function (request, reply) {
    if (request.params.id) {
      //if (resources.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);      //
      var actualIndex = Number(request.params.id) - 1;
      //create new object, convert to json
      
      finalObj = formatOrg(actualIndex);
      
      return reply(finalObj);
    }

    var objToReturn = [];

    for(var i=0; i < orgs[0].length; i++) {
      var bob = formatOrg(i);
      objToReturn.push(bob);
    }
    
    reply(objToReturn);
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

//misc print func's




/* 
===================================================
- ROUTES -
=================================================== 
*/


module.exports = [
  /*{ path: '/', method: 'GET', config: userController.getConfig },*/
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

