var Joi = require('joi');
var mysql = require('mysql');
var Boom = require('boom');
var async = require('async');

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



resourceController = {};
var resources = [];
var numRes = 0;
  //var resTypes = [];
  var resCategories = [];
  var resTopics =[];
  var resAcc = [];
  var resLanguages = [];
  var resTags = [];
  var resEnsembles = [];
  var resEth = [];
  var resDenominations = [];
  var resInstruments = [];

getResourcesJSON();

function getResourcesJSON() {
  //console.log("===== GETTING RESOURCES =====");
  connection.query(`SELECT * from resources`, function(err, rows, fields) {
    if (!err) {

      	var JSObj = rowsToJS(rows);
        //var JSObj = rows;

        resources = [];
        //resTypes = [];
        resCategories = [];
        resTopics =[];
        resAcc = [];
        resLanguages = [];
        resTags = [];
        resEnsembles = [];
        resEth = [];
        resDenominations = [];
        resInstruments = [];

      	//resources.push(JSObj);
        resources = JSObj;
      	numRes = resources.length;
        //console.log("rows[0]: ", JSObj[0]);

        //console.log("\nT: ", rows[0]);
        for(var i=0; i<JSObj.length; i++) { 
          popArray(JSObj[i]["ethnicities"], resEth);
          popArray(JSObj[i]["categories"], resCategories);
          popArray(JSObj[i]["topics"], resTopics);
          popArray(JSObj[i]["accompaniment"], resAcc);
          popArray(JSObj[i]["languages"], resLanguages);
          popArray(JSObj[i]["ensembles"], resEnsembles);
          popArray(JSObj[i]["tags"], resTags);
          popArray(JSObj[i]["instruments"], resInstruments);
          popArray(JSObj[i]["denominations"], resDenominations);
          //popArray(JSObj[i]["types"], resTypes);

          //console.log("\nETH[",i, "] : ", resEth[i]);
          //console.log("\nCAT[",i, "] : ", resCategories[i]);
          //console.log("\nTOPICS[",i, "] : ", resTopics[i]);
          //console.log("\nACC[",i, "] : ", resAcc[i]);
          //console.log("\nLANG[",i, "] : ", resLanguages[i]);
          //console.log("\nENSEMBLES[",i, "] : ", resEnsembles[i]);
          //console.log("\nresTags[",i, "] : ", resTags[i]);
        }
        
        
        //popArray(JSObj[0].categories, resCategories);


    }
    else
      console.log('Error while performing Resources Query.');

  });
}//end func


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
        //console.log(key);

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


function insertResource(theObj) {

  var justResource = JSON.parse(JSON.stringify(theObj));

  justResource.categories = JSON.stringify(justResource.categories);
  justResource.topics = JSON.stringify(justResource.topics);
  justResource.accompaniment = JSON.stringify(justResource.accompaniment);
  justResource.ethnicities = JSON.stringify(justResource.ethnicities);
  justResource.tags = JSON.stringify(justResource.tags);
  justResource.ensembles = JSON.stringify(justResource.ensembles);
  justResource.languages = JSON.stringify(justResource.languages);
  justResource.instruments = JSON.stringify(justResource.instruments);
  justResource.denominations = JSON.stringify(justResource.denominations);

  //console.log("\n\nJUSTRESOURCE: \n\n", justResource);

  // TYPE CONVERSION
  if(typeof justResource.hymn_soc_member == "string") {
    if(justResource.hymn_soc_member == "no" || justResource.hymn_soc_member == "No") {
      justResource.hymn_soc_member = false;
    } else {
      justResource.hymn_soc_member = true;
    }
  } else if(typeof justResource.hymn_soc_member == "number") {
    if(justResource.hymn_soc_member == 0) {
      justResource.hymn_soc_member = false;
    } else {
      justResource.hymn_soc_member = true;
    }
  } else {
    //neither a string nor Number
    justResource.hymn_soc_member = false;
  }

  if(typeof justResource.is_free == "string") {
    if(justResource.is_free == "yes" || justResource.is_free == "Yes") {
      justResource.is_free = 1;
    } else if(justResource.is_free == "no" || justResource.is_free == "No"){
      justResource.is_free = 0;
    } else {
      justResource.is_free = 2;
    }
  } else if(typeof justResource.is_free !== "number") {
    justResource.is_free = 2;
  }

  // END TYPE CONVERSION

	connection.query(`INSERT INTO resources set ?`, justResource, function(err, rows, fields) {
        if(err) { throw err; }

        var JSObj = rowsToJS(theObj);
        resources.push(JSObj);    
    });
}

function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}

function formatResource(actualIndex) {
  var resourceData = {};

  resourceData = {
    id:             resources[actualIndex].id,
    title:          resources[actualIndex].name,
    type:           resources[actualIndex].type,
    url:            resources[actualIndex].website,
    author:         resources[actualIndex].author,
    resource_date:  resources[actualIndex].resource_date,
    description:    resources[actualIndex].description,
    parent:         resources[actualIndex].parent,
    is_active:      resources[actualIndex].is_active,
    high_level:     resources[actualIndex].high_level,
    city:           resources[actualIndex].city,
    state:          resources[actualIndex].state,
    country:        resources[actualIndex].country,
    hymn_soc_member:resources[actualIndex].hymn_soc_member,
    is_free:        resources[actualIndex].is_free,
    user_id:        resources[actualIndex].user_id,
    user:           resources[actualIndex].user,
    pract_schol:    resources[actualIndex].pract_schol,
    approved:       resources[actualIndex].approved,
/*
    languages:      resources[actualIndex].languages,
    ethnicities:    resources[actualIndex].ethnicities,
    ensembles:      resources[actualIndex].ensembles,
    categories:     resources[actualIndex].categories,
    accompaniment: 	resources[actualIndex].accompaniment,
    topics:         resources[actualIndex].topics,
    tags:           resources[actualIndex].tags,
    denominations:  resources[actualIndex].denominations,
    instruments:    resources[actualIndex].instruments
*/
    languages:      resLanguages[actualIndex],
    ethnicities:    resEth[actualIndex],
    ensembles:      resEnsembles[actualIndex],
    categories:     resCategories[actualIndex],
    accompaniment: 	resAcc[actualIndex],
    topics:         resTopics[actualIndex],
    tags:           resTags[actualIndex],
    denominations:  resDenominations[actualIndex],
    instruments:    resInstruments[actualIndex]


  };

  resourceData.is_active = reformatTinyInt(resourceData.is_active, false);
  resourceData.high_level = reformatTinyInt(resourceData.high_level, false);
  resourceData.hymn_soc_member = reformatTinyInt(resourceData.hymn_soc_member, false);
  resourceData.is_free = reformatTinyInt(resourceData.is_free, false);
  resourceData.pract_schol = reformatTinyInt(resourceData.pract_schol, true);
  resourceData.approved = reformatTinyInt(resourceData.approved, false);

  //format 
  /*
  resourceData.ethnicities = JSON.parse(resourceData.ethnicities);
  resourceData.tags = JSON.parse(resourceData.tags);
  resourceData.topics = JSON.parse(resourceData.topics);
  resourceData.languages = JSON.parse(resourceData.languages);
  resourceData.ensembles = JSON.parse(resourceData.ensembles);
  resourceData.accompaniment = JSON.parse(resourceData.accompaniment);
  resourceData.categories = JSON.parse(resourceData.categories);
  */
  //end formatting

  var theUrl = "/resource/" + String(actualIndex+1);

  var finalObj = {
    url: theUrl,
    data: resourceData
  };

  //var str = JSON.stringify(finalObj);

  return finalObj;


};

function reformatTinyInt(toFormat, pract_schol) {
  if(toFormat == 1) {
    return("true");
  } else if(toFormat == 0) {
    return("false");
  } else if(pract_schol) {
    return("both");
  } else {
    return("partially");
  }
}

/*
===================================================
- RESOURCE Controllers -
===================================================
*/

//RESOURCE GET REQUEST
resourceController.getConfig = {

  handler: function (request, reply) {

    connection.query(`SELECT * from resources`, function(err, rows, fields) {
    if (!err) {

      var JSObj = rowsToJS(rows);
      //var JSObj = rows;

      resources = [];
      //resTypes = [];
      resCategories = [];
      resTopics =[];
      resAcc = [];
      resLanguages = [];
      resTags = [];
      resEnsembles = [];
      resEth = [];
      resDenominations = [];
      resInstruments = [];

      resources = JSObj;
      numRes = resources.length;

      for(var i=0; i<JSObj.length; i++) { 
        popArray(JSObj[i]["ethnicities"], resEth);
        popArray(JSObj[i]["categories"], resCategories);
        popArray(JSObj[i]["topics"], resTopics);
        popArray(JSObj[i]["accompaniment"], resAcc);
        popArray(JSObj[i]["languages"], resLanguages);
        popArray(JSObj[i]["ensembles"], resEnsembles);
        popArray(JSObj[i]["tags"], resTags);
        popArray(JSObj[i]["instruments"], resInstruments);
        popArray(JSObj[i]["denominations"], resDenominations);
        //popArray(JSObj[i]["types"], resTypes);

      }
      
      if (request.params.id) {
          if ((numRes <= request.params.id - 1) || (0 > request.params.id - 1)) {
            //return reply('Not enough resources in the database for your request').code(404);
            return reply(Boom.notFound("Index out of range for Resources get request"));
          }
          //if (resources.length <= request.params.id - 1) return reply('Not enough resources in the database for your request').code(404);
          var actualIndex = Number(request.params.id -1 );  

          //create new object, convert to json
          //only get resources that are NOT approved
          
          if(resources[actualIndex].approved == false || resources[actualIndex].approved == 0) {
            var str = formatResource(actualIndex);
            return reply(str);
          } else {
            return reply(Boom.badRequest("The Resource you request is already approved"));
          }
          


        //return reply(resources[actualId]);
      }

      //if no ID specified
      var objToReturn = [];

      for(var i=0; i < resources.length; i++) {
        //var bob = formatResource(i);   
        if(resources[i].approved == 0) {
          var str = {
            id:     resources[i].id,
            user:   resources[i].user,
            title:  resources[i].name
          }
          objToReturn.push(str);
        }
        
      }//end for

      //console.log(objToReturn);
      if(objToReturn.length <= 0) {
        return reply(Boom.badRequest("nothing to return"));
      } else {
        reply(objToReturn);
      }  


    }//end if no error...
    else
      console.log('Error while performing Resources Query.');

    });

    

  }//end handler
};

//BELOW is for the POST request
function insertFirst(toInsert, _callback){

    insertResource(toInsert);

    _callback();    
}

function insertAndGet(toInsert){

    insertFirst(toInsert, function() {
        getResourcesJSON();
        
    });    
}


//RESOURCE POST REQUEST
resourceController.postConfig = {
  //auth: 'high_or_admin',
  handler: function(req, reply) {

  	//getResources();

  	var theResourceID = resources.length+1;

    var theData = {
      name:             req.payload.data.title,
      type:             req.payload.data.type,
      website:          req.payload.data.url,
      author:           req.payload.data.author,
      parent:           req.payload.data.parent,
      description:      req.payload.data.description,
      hymn_soc_member:  req.payload.data.hymn_soc_member,
      is_free:          req.payload.data.is_free,   
      city:             req.payload.data.city,
      state:            req.payload.data.state,
      country:          req.payload.data.country,
      high_level:       req.payload.data.high_level,
      is_active:        1,
      user_id:          req.payload.uid,
      user:             req.payload.user,
      pract_schol:      req.payload.data.pract_schol,
      //approved not included because by default it is not approved

      categories:       req.payload.data.categories,
      topics:            req.payload.data.topics,
      accompaniment:    req.payload.data.accompaniment,
      languages:        req.payload.data.languages,
      ensembles:        req.payload.data.ensembles,
      ethnicities:      req.payload.data.ethnicities,
      tags:             req.payload.data.tags,
      denominations:    req.payload.data.denominations,
      instruments:      req.payload.data.instruments

    };    
    
    

    //insertResource(theData);

    insertAndGet(theData);

    var toReturn = {

    	resource_id: resources.length +1 /* +1 or not?... */
    }

    return reply(toReturn);

  }
  /* ADD COMMA ^
  validate: {
    payload: {
      title: 	Joi.string().required(),
      url: 	Joi.string().required(),
      description: Joi.string().required(),
      author: 	Joi.string().allow(''),

      ethnicities: Joi.array().allow(''),
      categories: Joi.array().allow(''),
      topic: 	Joi.array().allow(''),
      accompaniment: Joi.array().allow(''),
      languages: Joi.array().allow(''),
      ensembles: Joi.array().allow(''),
      //is_free: Joi.string().required()
      parent: 	Joi.string().allow(''),
      hymn_soc_member: Joi.string().allow(''),
      is_free: Joi.string().allow('')

    }
  }
*/
};

//RESOURCE DELETE ENDPOINT
resourceController.deleteConfig = {
    //auth: 'admin_only',
    handler: function(request, reply) {
        
        var query = connection.query(`DELETE FROM resources WHERE id=${req.params.id}`, function(err, rows, fields) {
          if(err) { return reply(Boom.badRequest("error when deleting from resources")); }
          return reply ({ 
            code: 202,
            message: `Successfully deleted resource with id=${req.params.id}`
          });
        });

    }
};

//RESOURCE CHANGE VARIABLE ENDPOINT
/* receive in body:
  {
    "column": "column_to_update",
    "value": "value_to_place"
  }
*/
resourceController.updateConfig = {
    //auth: 'admin_only',
    handler: function(request, reply) {
        getResourcesJSON();

        if (request.params.id) {
            if (numRes <= request.params.id - 1) {
              //return reply('Not enough resources in the database for your request').code(404);
              return reply(Boom.notFound());
            }
            //if (resources.length <= request.params.id - 1) return reply('Not enough resources in the database for your request').code(404);
            var actualIndex = Number(request.params.id -1 );  //if you request for resources/1 you'll get resources[0]

            var mysqlIndex = Number(request.params.id);

            var theCol = request.payload.column;
            var theVal = request.payload.value;

            if(theCol == "id") { return reply(Boom.unauthorized("cannot change the id... what are you doing?")); }

            var query = connection.query(`
            UPDATE resources SET ?
            WHERE ?`, [{ [theCol]: theVal}, {id: mysqlIndex}],function(err, rows, fields) {
              if(err) {
                  console.log(query.sql);
                  return reply(Boom.badRequest(`invalid query when updating resources on column ${request.payload.what_var} with value = ${request.payload.what_val} `));
              } else {
                getResourcesJSON();
                console.log(query.sql);
                console.log("set resource #", mysqlIndex, ` variable ${theCol} = ${theVal}`);
              }

              return reply( {statusCode: 201} );
            });

          //return reply(resources[actualId]);
        }


    }
};

resourceController.getApprovedConfig = {

  handler: function (request, reply) {

    connection.query(`SELECT * from resources`, function(err, rows, fields) {
    if (!err) {

      var JSObj = rowsToJS(rows);
      //var JSObj = rows;

      resources = [];
      //resTypes = [];
      resCategories = [];
      resTopics =[];
      resAcc = [];
      resLanguages = [];
      resTags = [];
      resEnsembles = [];
      resEth = [];
      resDenominations = [];
      resInstruments = [];

      resources = JSObj;
      numRes = resources.length;

      for(var i=0; i<JSObj.length; i++) { 
        popArray(JSObj[i]["ethnicities"], resEth);
        popArray(JSObj[i]["categories"], resCategories);
        popArray(JSObj[i]["topics"], resTopics);
        popArray(JSObj[i]["accompaniment"], resAcc);
        popArray(JSObj[i]["languages"], resLanguages);
        popArray(JSObj[i]["ensembles"], resEnsembles);
        popArray(JSObj[i]["tags"], resTags);
        popArray(JSObj[i]["instruments"], resInstruments);
        popArray(JSObj[i]["denominations"], resDenominations);
        //popArray(JSObj[i]["types"], resTypes);

      }
      
      if (request.params.id) {
          console.log(request.path[2,5]);
          if ((numRes <= request.params.id - 1) || (0 > request.params.id - 1)) {
            //return reply('Not enough resources in the database for your request').code(404);
            return reply(Boom.notFound("Index out of range for Resources get request"));
          }
          //if (resources.length <= request.params.id - 1) return reply('Not enough resources in the database for your request').code(404);
          var actualIndex = Number(request.params.id -1 );  

          if(resources[actualIndex].approved == true || resources[actualIndex].approved == 1) {
            var str = formatResource(actualIndex);
            return reply(str);
          } else {
            return reply(Boom.badRequest("The Resource you request is NOT approved"));
          }

        //return reply(resources[actualId]);
      }

      //if no ID specified
      var objToReturn = [];

      for(var i=0; i < resources.length; i++) {
        //var bob = formatResource(i);
        if(resources[i].approved == 1) {
          var str = {
            id:     resources[i].id,
            user:   resources[i].user,
            title:  resources[i].name
          }
          objToReturn.push(str);
        }
      }//end for

      //console.log(objToReturn);
      if(objToReturn.length <= 0) {
        return reply(Boom.badRequest("nothing to return"));
      } else {
        reply(objToReturn);
      }  


    }//end if no error...
    else
      console.log('Error while performing Resources Query.');

    });

    

  }//end handler
};



module.exports = [
	{ path: '/resource', method: 'POST', config: resourceController.postConfig },
  { path: '/resource/{id?}', method: 'GET', config: resourceController.getConfig },
  { path: '/resource/approved/{id?}', method: 'GET', config: resourceController.getApprovedConfig },
  { path: '/resource/{id}', method: 'DELETE', config: resourceController.deleteConfig},
  { path: '/resource/{id}', method: 'PUT', config: resourceController.updateConfig}
];
