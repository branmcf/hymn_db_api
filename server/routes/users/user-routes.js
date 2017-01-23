var Joi = require('joi')
var mysql = require('mysql')

//mysql connection
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123',
  database : 'testDb'
});

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


        getInter("Ethnicities", "Users", "user_ethnicities", "ethnicity_id", "user_id", eth, numUsers );
        
        console.log(`selected ${numUsers} users...`);
        

      }//end if statement
      else
        console.log('Error while performing Users Query.');

  }); //end connection.connect

};//end get users from db

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
      console.log("error with hash function, new password will default to \"password123\". ");
      newUser.password = "password123";
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




module.exports = [
	{ path: '/user', method: 'POST', config: userController.postConfig },
	{ path: '/user/{id?}', method: 'GET', config: userController.getConfig }
];