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

connection.connect();

orgController = {};
var orgs = [];
  var numOrgs = 0;
  var orgDen = [];
  var orgTags = [];
  var orgSongTypes = [];
  var orgInstr = [];
  var orgWorshipTypes = [];
  var orgEth = [];
  var orgCongs = [];

getOrganizations();

function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}

function getOrganizations() {
  //get orgs from db
  connection.query('SELECT * from organizations', function(err, rows, fields) {
    if (!err) {

    orgs = [];
    numOrgs = 0;
    orgDen = [];
    orgTags = [];
    orgSongTypes = [];
    orgInstr = [];
    orgWorshipTypes = [];
    orgEth = [];
    orgCongs = [];

      var JSObj = rowsToJS(rows);
      orgs.push(JSObj);

      numOrgs = orgs[0].length;

/*
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
*/
    }
    else
      console.log('Error while performing Events Query.');

  });
}//end getOrganizations function

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
- ORGANIZATINS -
===================================================
*/

function formatOrg(actualIndex) {
  var orgData = {};

  orgData = {
    id:             orgs[0][actualIndex].id,
    name:           orgs[0][actualIndex].name,
    url:            orgs[0][actualIndex].website,
    parent:         orgs[0][actualIndex].parent,
    //denomination(s)
    //denomination:   orgDen[actualIndex],
    denomination:   orgs[0][actualIndex].denomination,
    city:        	  orgs[0][actualIndex].city,
    state:       	  orgs[0][actualIndex].state,
    country:     	  orgs[0][actualIndex].country,
    geographic_area:orgs[0][actualIndex].geography,
    is_org_free:    orgs[0][actualIndex].is_free,
    events_free:    orgs[0][actualIndex].offers_free_events,
    membership_free:orgs[0][actualIndex].membership_free,
    mission:        orgs[0][actualIndex].mission,
    process:        orgs[0][actualIndex].the_process,
    //tags
    //tags:           orgTags[actualIndex],
    hymn_soc_member:orgs[0][actualIndex].hymn_soc_member,
    is_active:      orgs[0][actualIndex].is_active,
    high_level:     orgs[0][actualIndex].high_level
    //song types
    //song_types:     orgSongTypes[actualIndex],
    //instrument types
    //instrument_types:orgInstr[actualIndex],
    //worship types
    //worship_types:  orgWorshipTypes[actualIndex],
    //ethnicities
    //ethnicities:   orgEth[actualIndex],
    //congregations
    //congregations:  orgCongs[actualIndex]


  };

  var theUrl = "/orgs/" + String(actualIndex+1);

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

        getOrganizations();
        
      //if (resources.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);      //
      if ((numOrgs <= request.params.id - 1) || (0 > request.params.id - 1)) {
          //return reply('Not enough resources in the database for your request').code(404);
          return reply(Boom.notFound("Index out of range for Orgs get request"));
      }

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

//ORG POST REQUEST
orgController.postConfig = {

  handler: function(req, reply) {

    getOrganizations();

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
      offers_free_events: req.payload.data.events_free,
      membership_free: req.payload.data.membership_free,
      mission: req.payload.data.mission,
      the_process: req.payload.data.process,
      //tag_id: req.payload.data.tag_id,
      hymn_soc_member: req.payload.data.hymn_soc_member
      //is_active: req.payload.data.is_active,
      //high_level: req.payload.data.high_level

    };

    if(typeof newOrg.membership_free !== "undefined") {
      if(typeof newOrg.membership_free == "string") {
        if(newOrg.membership_free == "Yes" || newOrg.membership_free == "yes") {
          newOrg.membership_free = 1;
        } else if(newOrg.membership_free == "No" || newOrg.membership_free == "no") {
          newOrg.membership_free = 0;
        } else {
          newOrg.membership_free = 2;
        }
      } else if(typeof newOrg.membership_free !== "number") {
        newOrg.membership_free = 2;
      }
    }//end if not undefined...

    if(typeof newOrg.hymn_soc_member !== "undefined") {
      if(typeof newOrg.hymn_soc_member == "string") {
        if(newOrg.hymn_soc_member == "Yes" || newOrg.hymn_soc_member == "yes") {
          newOrg.hymn_soc_member = 1;
        } else if(newOrg.hymn_soc_member == "No" || newOrg.hymn_soc_member == "no") {
          newOrg.hymn_soc_member = 0;
        } else {
          newOrg.hymn_soc_member = 2;
        }
      } else if(typeof newOrg.hymn_soc_member !== "number") {
        newOrg.hymn_soc_member = 2;
      }
    }//end if not undef...

    if(typeof newOrg.is_free !== "undefined") {
      if(typeof newOrg.is_free == "string") {
        if(newOrg.is_free == "Yes" || newOrg.is_free == "yes") {
          newOrg.is_free = 1;
        } else if(newOrg.is_free == "No" || newOrg.is_free == "no"){
          newOrg.is_free = 0;
        } else {
          newOrg.is_free = 2;
        }
      } else if(typeof newOrg.is_free !== "number") {
        newOrg.is_free = 2;
      }
    }//end if not undefined

    if(typeof newOrg.offers_free_events !== "undefined") {
      if(typeof newOrg.offers_free_events == "string") {
        if(newOrg.offers_free_events == "Yes" || newOrg.offers_free_events == "yes") {
          newOrg.offers_free_events = 1;
        } else if(newOrg.offers_free_events == "No" || newOrg.offers_free_events == "no"){
          newOrg.offers_free_events = 0;
        } else {
          newOrg.offers_free_events = 2;
        }
      } else if(typeof newOrg.offers_free_events !== "number") {
        newOrg.offers_free_events = 2;
      }
    }//end if not defined 

    // mysql
    //connection.connect();
    connection.query(
      'INSERT INTO organizations SET ?', newOrg,
      function(err, rows) {
        if(err) {
          throw new Error(err);
          return;
        }

        var JSObj = rowsToJS(newOrg);

        orgs[0].push(JSObj);

        var toReturn = {

        	org_id: orgs[0].length /* +1 or not?... */
        }

        return reply(toReturn);

      }
    );
    //end mysql


    //reply(newRes);
  }
  /* ADD COMMA ^
  validate: {
    payload: {
      name: Joi.string().required(),
      url: Joi.string().required()

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
  */

};

module.exports = [
  	{ path: '/orgs', method: 'POST', config: orgController.postConfig},
  	{ path: '/orgs/{id?}', method: 'GET', config: orgController.getConfig }
  ];
