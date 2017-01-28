var Joi = require('joi')
var mysql = require('mysql')

var options = require('../../config/config.js');

//mysql connection
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : options.user,
  password : options.password,
  database : options.database
});

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
    name:          orgs[0][actualIndex].name,
    url:            orgs[0][actualIndex].website,
    parent:         orgs[0][actualIndex].parent_org_id,
    //denomination(s)   
    denomination:   orgDen[actualIndex],      
    city:        	orgs[0][actualIndex].city,
    state:       	orgs[0][actualIndex].state,
    country:     	orgs[0][actualIndex].country,
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

//ORG POST REQUEST
orgController.postConfig = {
	auth: {
  		mode: 'try'
  	},
  handler: function(req, reply) {
    var newOrg = { 
      name: req.payload.name, 
      url: req.payload.website, 
      
      //parent_org_id: req.payload.parent,

      //denomination: req.payload.denomination_id,
      city: req.payload.city,
      state: req.payload.state,
      country: req.payload.country,
      geography: req.payload.geographic_area,
      is_free: req.payload.is_org_free,
      offers_free_events: req.payload.events_free,
      membership_free: req.payload.membership_free,
      mission: req.payload.mission,
      process: req.payload.process,
      tag_id: req.payload.tag_id,
      hymn_soc_member: req.payload.hymn_soc_member,
      is_active: req.payload.is_active,
      high_level: req.payload.high_level

    };

    // mysql
    //connection.connect();
    connection.query(
      'INSERT INTO organizations SET ?', newOrg,
      function(err, rows) {
        if(err) {
          throw new Error(err);
          return;
        }

        orgs[0].push(newOrg);

        reply([{
          statusCode: 200,
          message: 'Inserted Successfully',
        }]);
        
      }
    );
    //end mysql

    
    //reply(newRes);
  },
  validate: {
    payload: {
      name: Joi.string().required(),
      url: Joi.string().required()
      /*
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
      */

    }
  }

};

module.exports = [
  	{ path: '/organization/', method: 'POST', config: orgController.postConfig},
  	{ path: '/organization/{id?}', method: 'GET', config: orgController.getConfig }
  ];