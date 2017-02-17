var Joi = require('joi');
var mysql = require('mysql');
var Boom = require('boom');

var options = require('../../config/config.js');

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

//connection.connect();

congController = {};
var congregations = [];
  var numCongs = 0;


getcongregationsJSON();



function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}

function getcongregationsJSON() {
  //get congregations from db
  connection.query('SELECT * from congregations', function(err, rows, fields) {
    if(err) { console.log('Error while performing congregations Query.'); throw err;}
    else {
    
    congregations = [];

    var JSObj = rowsToJS(rows);
    congregations = JSObj;
    
    numCongs = congregations.length;
 
    }      
      
  });
}//end getcongregationsJSON function


function insertCongregation(theObj) {

  var justCongregation = JSON.parse(JSON.stringify(theObj));

  justCongregation.categories = JSON.stringify(justCongregation.categories);
  justCongregation.ethnicities = JSON.stringify(justCongregation.ethnicities);
  justCongregation.tags = JSON.stringify(justCongregation.tags);
  justCongregation.instruments = JSON.stringify(justCongregation.instruments);

// TYPE CONVERSION
  if(typeof justCongregation.hymn_soc_member == "string") {
    if(justCongregation.hymn_soc_member == "no" || justCongregation.hymn_soc_member == "No") {
      justCongregation.hymn_soc_member = false;
    } else {
      justCongregation.hymn_soc_member = true;
    }
  } else if(typeof justCongregation.hymn_soc_member == "number") {
    if(justCongregation.hymn_soc_member == 0) {
      justCongregation.hymn_soc_member = false;
    } else {
      justCongregation.hymn_soc_member = true;
    }
  } else {
    //neither a string nor Number
    justCongregation.hymn_soc_member = false;
  }

  if(typeof justCongregation.is_free == "string") {
    if(justCongregation.is_free == "yes" || justCongregation.is_free == "Yes") {
      justCongregation.is_free = 1;
    } else if(justCongregation.is_free == "no" || justCongregation.is_free == "No") {
      justCongregation.is_free = 0;
    } else {
      justCongregation.is_free = 2;
    }
  } else if(typeof justCongregation.is_free !== "number") {
    justCongregation.is_free = 2;
  }


// END TYPE CONVERSION

	connection.query(`INSERT INTO congregations set ?`, justCongregation, function(err, rows, fields) {
        if(err) { throw err; }

        var JSObj = rowsToJS(theObj);

        congregations.push(JSObj);

        
    });
}//end func


/*
===================================================
- congregations -
===================================================
*/

function formatCong(actualIndex) {
  var congData = {};

  congData = {
    id:             congregations[actualIndex].id,
    name:           congregations[actualIndex].name,
    url:            congregations[actualIndex].website,
    parent:         congregations[actualIndex].parent,
    denomination:   congregations[actualIndex].denomination,
    city:        	  congregations[actualIndex].city,
    state:       	  congregations[actualIndex].state,
    country:     	  congregations[actualIndex].country,
    geographic_area:congregations[actualIndex].geography,
    is_free:        congregations[actualIndex].is_free,
    attendance:     congregations[actualIndex].attendance,
    hymn_soc_member:congregations[actualIndex].hymn_soc_member,
    is_active:      congregations[actualIndex].is_active,
    high_level:     congregations[actualIndex].high_level,
    user_id:        congregations[actualIndex].user_id,
    user:           congregations[actualIndex].user,
    shape:          congregations[actualIndex].shape,
    clothing:       congregations[actualIndex].priest_attire,    
    description_of_worship_to_guests: congregations[actualIndex].description_of_worship_to_guests,
    process:        congregations[actualIndex].process,
    approved:       congregations[actualIndex].approved,

    categories:     congregations[actualIndex].categories,
    instruments:    congregations[actualIndex].instruments,
    ethnicities:    congregations[actualIndex].ethnicities,
    tags:           congregations[actualIndex].tags

  };

  //format 
  congData.ethnicities = JSON.parse(congData.ethnicities);
  congData.tags = JSON.parse(congData.tags);
  congData.categories = JSON.parse(congData.categories);
  congData.instruments = JSON.parse(congData.instruments);
  //end formatting

  var theUrl = "/congregations/" + String(actualIndex+1);

  var finalObj = {
    url: theUrl,
    data: congData
  };

  //var str = JSON.stringify(finalObj);

  return finalObj;
}

//CONGREGATION GET REQUEST
congController.getConfig = {
  handler: function (request, reply) {
    if (request.params.id) {

        getcongregationsJSON();
        
      if ((numCongs <= request.params.id - 1) || (0 > request.params.id - 1)) {
          return reply(Boom.notFound("Index out of range for congregations get request"));
      }

      var actualIndex = Number(request.params.id) - 1;
      //create new object, convert to json

      finalObj = formatCong(actualIndex);

      return reply(finalObj);
    }

    var objToReturn = [];

    for(var i=0; i < congregations.length; i++) {
      var bob = formatCong(i);
      objToReturn.push(bob);
    }

    return reply(objToReturn);
  }
}
//
//BELOW is for the POST request
//
function insertFirst(toInsert, _callback){

    insertCongregation(toInsert);

    _callback();    
}

function insertAndGet(toInsert){

    insertFirst(toInsert, function() {
        getcongregationsJSON();
        //console.log("Done with post requst getOrg...");
    });    
}

//CONGREGATION POST REQUEST
congController.postConfig = {

  handler: function(req, reply) {

    //getcongregationsJSON();

    var theCongID = congregations.length+1;

    var newCong = {
      name: req.payload.data.name,
      website: req.payload.data.url,
      parent: req.payload.data.parent,
      denomination: req.payload.data.denomination,
      city: req.payload.data.city,
      state: req.payload.data.state,
      country: req.payload.data.country,
      geography: req.payload.data.geographic_area,
      is_free: req.payload.data.is_org_free,
      attendance: req.payload.data.attendance,
      process: req.payload.data.process,
      hymn_soc_member: req.payload.data.hymn_soc_member,
      user:             req.payload.user,
      user_id:          req.payload.uid,
      priest_attire:    req.payload.data.clothing,
      shape:            req.payload.data.shape,
      description_of_worship_to_guests: req.payload.data.description_of_worship_to_guests,

      categories:       req.payload.data.categories,
      instruments:      req.payload.data.instruments,
      ethnicities:      req.payload.data.ethnicities,
      tags:             req.payload.data.tags

    };

    insertAndGet(newCong);

    var toReturn = {
      cong_id: theCongID
    }

    return reply(toReturn);

      
  }//end handler  

}//end postConfig
  

//delete
congController.deleteConfig = {
  handler: function(request, reply) {
        getcongregationsJSON();

        if (request.params.id) {
            if ((numCongs <= request.params.id - 1) || (0 > request.params.id - 1)) {
              //return reply('Not enough users in the database for your request').code(404);
              return reply(Boom.notFound("Error with congregations DELETE endpoint"));
            }

            var query = connection.query(`
            UPDATE congregations SET is_active = false
            WHERE id = ${request.params.id}`, function(err, rows, fields) {
              if(err) {
                  return reply(Boom.badRequest(`Error while trying to DELETE organization with id=${request.params.id}...`));
              } else {
                  console.log("set cong #", request.params.id, " to innactive (is_active = false)");
              }

              getcongregationsJSON();

              reply([{
                statusCode: 200,
                message: `cong with id=${request.params.id} set to innactive`,
              }]);
            });

        } else {
          return reply(Boom.notFound("You must specify an id as a parameter"));
        }
    }//end handler
}

module.exports = [
  	{ path: '/congregation', method: 'POST', config: congController.postConfig},
  	{ path: '/congregation/{id?}', method: 'GET', config: congController.getConfig },
    { path: '/congregation/{id}', method: 'DELETE', config: congController.deleteConfig }
  ];
