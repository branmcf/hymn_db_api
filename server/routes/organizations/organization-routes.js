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

orgController = {};
var orgs = [];
var numOrgs = 0;
  var orgCategories = [];
  var orgInstruments = [];
  var orgEthnicities = [];
  var orgTags = [];
  var orgShape = [];
  var orgAttire = [];


getOrganizationsJSON();



function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}

function getOrganizationsJSON() {
  //get orgs from db
  connection.query('SELECT * from organizations', function(err, rows, fields) {
    if(err) { console.log('Error while performing orgs Query.'); throw err;}
    else {
    
    orgs = [];
    orgCategories = [];
    orgInstruments = [];
    orgEthnicities = [];
    orgTags = [];
    orgAttire = [];
    orgShape = [];

    var JSObj = rowsToJS(rows);
    orgs = JSObj;    
    numOrgs = orgs.length;

    //console.log("\nT: ", rows[0]);
    for(var i=0; i<JSObj.length; i++) { 
      popArray(JSObj[i]["ethnicities"], orgEthnicities);
      popArray(JSObj[i]["categories"], orgCategories);
      popArray(JSObj[i]["tags"], orgTags);
      popArray(JSObj[i]["instruments"], orgInstruments);
      popArray(JSObj[i]["shape"], orgShape);
      popArray(JSObj[i]["clothing"], orgAttire);

      //console.log("\nETH[",i, "] : ", resEth[i]);
      //console.log("\nCAT[",i, "] : ", resCategories[i]);
      //console.log("\nTOPICS[",i, "] : ", resTopics[i]);
      //console.log("\nACC[",i, "] : ", resAcc[i]);
      //console.log("\nLANG[",i, "] : ", resLanguages[i]);
      //console.log("\nENSEMBLES[",i, "] : ", resEnsembles[i]);
      //console.log("\nresTags[",i, "] : ", resTags[i]);
    }
 
    }      
      
  });
}//end getOrganizationsJSON function


function popArray(obj, whichArray) {
  
  obj = JSON.parse(obj);
  //console.log("after: ",  typeof obj, ": ", obj);
  var theKeys = [];

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {

      var theVal = obj[key];  //the corresponding value to the key:value pair that is either true, false, or a string

      if(key == 'Other' || key == 'other') {
        theKeys.push(obj[key]);
      } else if(theVal == 'True' || theVal == true || theVal == 'true' || theVal == 1) {
        key = key.replace(/_/g, " ");
        theKeys.push(key);
      } else {
        //false, dont add...
        //console.log("false for ", key, ", dont push");
      }
    }
  }

  whichArray.push(theKeys);
  //console.log("whichArray: ", whichArray);

}



function insertOrganization(theObj) {

  var justOrganization = JSON.parse(JSON.stringify(theObj));

  justOrganization.categories = JSON.stringify(justOrganization.categories);
  justOrganization.ethnicities = JSON.stringify(justOrganization.ethnicities);
  justOrganization.tags = JSON.stringify(justOrganization.tags);
  justOrganization.instruments = JSON.stringify(justOrganization.instruments);

// TYPE CONVERSION
  if(typeof justOrganization.hymn_soc_member == "string") {
    if(justOrganization.hymn_soc_member == "no" || justOrganization.hymn_soc_member == "No") {
      justOrganization.hymn_soc_member = false;
    } else {
      justOrganization.hymn_soc_member = true;
    }
  } else if(typeof justOrganization.hymn_soc_member == "number") {
    if(justOrganization.hymn_soc_member == 0) {
      justOrganization.hymn_soc_member = false;
    } else {
      justOrganization.hymn_soc_member = true;
    }
  } else {
    //neither a string nor Number
    justOrganization.hymn_soc_member = false;
  }

  if(typeof justOrganization.is_free == "string") {
    if(justOrganization.is_free == "yes" || justOrganization.is_free == "Yes") {
      justOrganization.is_free = 1;
    } else if(justOrganization.is_free == "no" || justOrganization.is_free == "No") {
      justOrganization.is_free = 0;
    } else {
      justOrganization.is_free = 2;
    }
  } else if(typeof justOrganization.is_free !== "number") {
    justOrganization.is_free = 2;
  }

  if(typeof justOrganization.events_free == "string") {
    if(justOrganization.events_free == "yes" || justOrganization.events_free == "Yes") {
      justOrganization.events_free = 1;
    } else if(justOrganization.events_free == "no" || justOrganization.events_free == "No") {
      justOrganization.events_free = 0;
    } else {
      justOrganization.events_free = 2;
    }
  } else if(typeof justOrganization.events_free !== "number") {
    justOrganization.events_free = 2;
  }

  if(typeof justOrganization.membership_free == "string") {
    if(justOrganization.membership_free == "yes" || justOrganization.membership_free == "Yes") {
      justOrganization.membership_free = 1;
    } else if(justOrganization.membership_free == "no" || justOrganization.membership_free == "No") {
      justOrganization.membership_free = 0;
    } else {
      justOrganization.membership_free = 2;
    }
  } else if(typeof justOrganization.membership_free !== "number") {
    justOrganization.membership_free = 2;
  }


// END TYPE CONVERSION

	connection.query(`INSERT INTO organizations set ?`, justOrganization, function(err, rows, fields) {
        if(err) { throw err; }

        var JSObj = rowsToJS(theObj);

        orgs.push(JSObj);

        
    });
}//end func


/*
===================================================
- ORGANIZATIONS -
===================================================
*/

function formatOrg(actualIndex) {
  var orgData = {};

  orgData = {
    id:             orgs[actualIndex].id,
    name:           orgs[actualIndex].name,
    url:            orgs[actualIndex].website,
    parent:         orgs[actualIndex].parent,
    denomination:   orgs[actualIndex].denomination,
    city:        	  orgs[actualIndex].city,
    state:       	  orgs[actualIndex].state,
    country:     	  orgs[actualIndex].country,
    geographic_area:orgs[actualIndex].geography,
    is_org_free:    orgs[actualIndex].is_free,
    events_free:    orgs[actualIndex].events_free,
    membership_free:orgs[actualIndex].membership_free,
    mission:        orgs[actualIndex].mission,
    process:        orgs[actualIndex].process,
    hymn_soc_member:orgs[actualIndex].hymn_soc_member,
    is_active:      orgs[actualIndex].is_active,
    high_level:     orgs[actualIndex].high_level,
    user_id:        orgs[actualIndex].user_id,
    user:           orgs[actualIndex].user,
    approved:       orgs[actualIndex].approved,

    clothing:       orgAttire[actualIndex],
    shape:          orgShape[actualIndex],
    categories:     orgCategories[actualIndex],
    instruments:    orgInstruments[actualIndex],
    ethnicities:    orgEthnicities[actualIndex],
    tags:           orgTags[actualIndex]

  };

  orgData.hymn_soc_member = reformatTinyInt(orgData.hymn_soc_member);
  orgData.is_active = reformatTinyInt(orgData.is_active);
  orgData.is_org_free = reformatTinyInt(orgData.is_org_free);
  orgData.high_level = reformatTinyInt(orgData.high_level);
  orgData.approved = reformatTinyInt(orgData.approved);
  orgData.events_free = reformatTinyInt(orgData.events_free);
  orgData.membership_free = reformatTinyInt(orgData.membership_free);
  

  //format 
  /*
  orgData.ethnicities = JSON.parse(orgData.ethnicities);
  orgData.tags = JSON.parse(orgData.tags);
  orgData.categories = JSON.parse(orgData.categories);
  orgData.instruments = JSON.parse(orgData.instruments);
  */
  //end formatting

  var theUrl = "/orgs/" + String(actualIndex+1);

  var finalObj = {
    url: theUrl,
    data: orgData
  };

  //var str = JSON.stringify(finalObj);

  return finalObj;
};


function reformatTinyInt(toFormat) {
  if(toFormat == 1) {
    return("true");
  } else if(toFormat == 0) {
    return("false");
  } else if(toFormat == 2){
    return("partially");
  } else {
    return(toFormat);
  }
}


//ORG GET REQUEST
orgController.getConfig = {
  handler: function (request, reply) {
    if (request.params.id) {

        getOrganizationsJSON();
        
      if ((numOrgs <= request.params.id - 1) || (0 > request.params.id - 1)) {
          return reply(Boom.notFound("Index out of range for Orgs get request"));
      }

      var actualIndex = Number(request.params.id) - 1;
      //create new object, convert to json

      if(orgs[actualIndex].approved == false || orgs[actualIndex].approved == 0) {
          var str = formatOrg(actualIndex);
          return reply(str);
      } else {
          return reply(Boom.badRequest("The Org you request is already approved"));
      }

    }

    var objToReturn = [];

    for(var i=0; i < orgs.length; i++) {
      //var bob = formatResource(i);
      if(orgs[i].approved == 0 && orgs[i].is_active == 1) {
        var str = {
          id:     orgs[i].id,
          user:   orgs[i].user,
          title:  orgs[i].name
        }
        objToReturn.push(str);
      }
    }//end for

    if(objToReturn.length <= 0) {
      return reply(Boom.badRequest("All orgs already approved, nothing to return"));
    } else {
      reply(objToReturn);
    }
  }
}
//
//BELOW is for the POST request
//
function insertFirst(toInsert, _callback){

    insertOrganization(toInsert);

    _callback();    
}

function insertAndGet(toInsert){

    insertFirst(toInsert, function() {
        getOrganizationsJSON();
        //console.log("Done with post requst getOrg...");
    });    
}

//ORG POST REQUEST
orgController.postConfig = {

  handler: function(req, reply) {

    //getOrganizationsJSON();

    var theOrgID = orgs.length+1;

    var newOrg = {
      name: req.payload.data.name,
      website: req.payload.data.url,
      parent: req.payload.data.parent,
      denomination: req.payload.data.denomination,
      city: req.payload.data.city,
      state: req.payload.data.state,
      country: req.payload.data.country,
      geography: req.payload.data.geographic_area,
      is_free: req.payload.data.is_org_free,
      events_free: req.payload.data.events_free,
      membership_free: req.payload.data.membership_free,
      mission: req.payload.data.mission,
      process: req.payload.data.process,
      hymn_soc_member: req.payload.data.hymn_soc_member,
      user:             req.payload.user,
      user_id:          req.payload.uid,
      clothing:    req.payload.data.clothing,
      shape:            req.payload.data.shape,

      categories:       req.payload.data.categories,
      instruments:      req.payload.data.instruments,
      ethnicities:      req.payload.data.ethnicities,
      tags:             req.payload.data.tags,
      is_active: 1

    };

    insertAndGet(newOrg);

    var toReturn = {
      org_id: theOrgID
    }

    return reply(toReturn);

      
  }//end handler  

}//end postConfig
  

//delete
orgController.deleteConfig = {
  handler: function(request, reply) {
        getOrganizationsJSON();

        if (request.params.id) {
            if ((numOrgs <= request.params.id - 1) || (0 > request.params.id - 1)) {
              //return reply('Not enough users in the database for your request').code(404);
              return reply(Boom.notFound("Error with organizations DELETE endpoint"));
            }

            var query = connection.query(`
            UPDATE organizations SET is_active = false
            WHERE id = ${request.params.id}`, function(err, rows, fields) {
              if(err) {
                  return reply(Boom.badRequest(`Error while trying to DELETE organization with id=${request.params.id}...`));
              } else {
                  console.log("set organization #", request.params.id, " to innactive (is_active = false)");
              }

              getOrganizationsJSON();

              reply([{
                statusCode: 200,
                message: `organization with id=${request.params.id} set to innactive`,
              }]);
            });

        } else {
          return reply(Boom.notFound("You must specify an id as a parameter"));
        }
    }//end handler
};

orgController.activateConfig = {
    handler: function(request, reply) {
        getOrganizationsJSON();
      	
        if (request.params.id) {
            if (numOrgs <= request.params.id - 1) {
              //return reply('Not enough orgs in the database for your request').code(404);
              return reply(Boom.notFound());
            }
            //if (orgs.length <= request.params.id - 1) return reply('Not enough orgs in the database for your request').code(404);
            var actualIndex = Number(request.params.id -1 );  //if you request for orgs/1 you'll get orgs[0]

            var mysqlIndex = Number(request.params.id);

            var theCol = request.params.what_var;
            var theVal = request.params.what_val;

            if(theCol == "id") { return reply(Boom.unauthorized("cannot change that...")); }

            var query = connection.query(`
            UPDATE organizations SET ?
            WHERE ?`, [{ [theCol]: theVal}, {id: mysqlIndex}],function(err, rows, fields) {
              if(err) {
                  console.log(query.sql);
                  return reply(Boom.badRequest(`invalid query when updating organizations on column ${request.params.what_var} with value = ${request.params.what_val} `));
              } else {
                getOrganizationsJSON();
                console.log(query.sql);
                console.log("set org #", mysqlIndex, ` variable ${theCol} = ${theVal}`);
              }

              return reply( {statusCode: 201} );
            });

          //return reply(organizations[actualId]);
        }


    }

}

module.exports = [
  	{ path: '/orgs', method: 'POST', config: orgController.postConfig},
  	{ path: '/orgs/{id?}', method: 'GET', config: orgController.getConfig },
    { path: '/orgs/{id}', method: 'DELETE', config: orgController.deleteConfig },
    { path: '/orgs/{what_var}/{what_val}/{id}', method: 'PUT', config: orgController.activateConfig}
  ];
