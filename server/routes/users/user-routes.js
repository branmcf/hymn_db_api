var Joi = require('joi');
var mysql = require('mysql');
var Boom = require('boom');

var options = require('../../config/config.js');

//mysql connection
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : options.user,
  password : options.password,
  database : options.database
});

connection.connect();

//user-routes.js

var userController = {};
var users = [];
  var eth = [];
  var numUsers = 0;

getUsers();

function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}

//get users from db
function getUsers() {

  //console.log(">>>>>getUsers()");

  connection.query(`SELECT
    id,
    email,
    password,
    first_name,
    last_name,
    reg_date,
    is_active,
    high_level,
    city,
    state,
    country,
    website,
    hymn_soc_member
    from users`, function(err, rows, fields) {

      if (!err) {

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
    first_name:       users[0][actualIndex].first_name,
    hymn_soc_member:  users[0][actualIndex].hymn_soc_member,
    last_name:        users[0][actualIndex].last_name,
    is_active:        users[0][actualIndex].is_active,
    reg_date:         users[0][actualIndex].reg_date,
    high_level:       users[0][actualIndex].high_level,
    city:          users[0][actualIndex].city,
    state:         users[0][actualIndex].state,
    country:       users[0][actualIndex].country,
    website:          users[0][actualIndex].website,
    ethnicity_name:   eth[0]

  };

  //console.log(`end getInter()`);

  return userData;
}

//USER GET REQUEST
userController.getConfig = {
  handler: function (request, reply) {
    //console.log("eth[x]: ", eth[Number(request.params.id-1)]);

    getUsers();

    //console.log("\n\n======================TOTAL USERS: ", numUsers, "\n\n");

    if (request.params.id) {
      if (numUsers <= request.params.id - 1) {
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
  }
};


//USER POST REQUEST
userController.postConfig = {

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
      website:          req.payload.website,
      ethnicity_name:   req.payload.ethnicity_name,
      ethnicity_name2:  req.payload.ethnicity_name2,
      ethnicity_name3:  req.payload.ethnicity_name3,
      ethnicity_name4:  req.payload.ethnicity_name4
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



  },
  validate: {
    payload: {
      email:      Joi.string().email(),
      password:   Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
      first_name: Joi.string().required(),
      last_name:  Joi.string().required()
    }
  }

};

userController.loginConfig = {

  handler: function(req, reply) {

    getUsers();

    console.log("BEGIN LOGIN");

    //console.log("\n\n======================TOTAL USERS: ", numUsers, "\n\n");

    var newUser = {
      email:      req.payload.email,
      password:   req.payload.password
    };


    for(var i=0; i< users[0].length; i++) {
      if(users[0][i].email == newUser.email &&
         users[0][i].password == newUser.password) {

        console.log("found matching user");

        var toReturn = {
          user_id: users[0][i].id,
          first_name: users[0][i].first_name,
          last_name: users[0][i].last_name
        }

        return reply(toReturn);
      }//end if statement
      else if(i+1 == users[0].length) {
        console.log("no user in database with that email and/or password");
        return reply(Boom.notFound('Invalid username and/or password combination'));
      }
    }//end for loop

  },

  validate: {
    payload: {
      email: Joi.string().required(),
      password: Joi.string().min(4).max(64).required()
    }
  }

}




module.exports = [
	{ path: '/user', method: 'POST', config: userController.postConfig },
	{ path: '/user/{id?}', method: 'GET', config: userController.getConfig },
    { path: '/login', method: 'POST', config: userController.loginConfig}

];
