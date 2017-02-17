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



resourceController = {};
var resources = [];
  var numRes = 0;
  var resTypes = [];
  var resCategories = [];
  var resTopics =[];
  var resAcc = [];
  var resLanguages = [];
  var resTags = [];
  var resEnsembles = [];
  var resEth = [];

getResourcesJSON();

function getResourcesJSON() {
  console.log("===== GETTING RESOURCES =====");
  connection.query(`SELECT * from resources`, function(err, rows, fields) {
    if (!err) {

      	var JSObj = rowsToJS(rows);

        resources = [];
        resTypes = [];
        resCategories = [];
        resTopics =[];
        resAcc = [];
        resLanguages = [];
        resTags = [];
        resEnsembles = [];
        resEth = [];

      	//resources.push(JSObj);
        resources = JSObj;
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\nresources: ", resources);
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
      	numRes = resources.length;

    }
    else
      console.log('Error while performing Resources Query.');

  });
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

/*
===================================================
- -
===================================================
*/




/*
===================================================
- -
===================================================
*/

function formatResource(actualIndex) {
  var resourceData = {};

  resourceData = {
    id:             resources[actualIndex].id,
    title:          resources[actualIndex].name,
    type:           resources[actualIndex].type,
    url:            resources[actualIndex].website,
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

    languages:      resources[actualIndex].languages,
    ethnicities:    resources[actualIndex].ethnicities,
    ensembles:      resources[actualIndex].ensembles,
    categories:     resources[actualIndex].categories,
    accompaniment: 	resources[actualIndex].accompaniment,
    topics:         resources[actualIndex].topics,
    tags:           resources[actualIndex].tags

  };

  //format 
  resourceData.ethnicities = JSON.parse(resourceData.ethnicities);
  resourceData.tags = JSON.parse(resourceData.tags);
  resourceData.topics = JSON.parse(resourceData.topics);
  resourceData.languages = JSON.parse(resourceData.languages);
  resourceData.ensembles = JSON.parse(resourceData.ensembles);
  resourceData.accompaniment = JSON.parse(resourceData.accompaniment);
  resourceData.categories = JSON.parse(resourceData.categories);
  //end formatting

  var theUrl = "/resource/" + String(actualIndex+1);

  var finalObj = {
    url: theUrl,
    data: resourceData
  };

  //var str = JSON.stringify(finalObj);

  return finalObj;


}

/*
===================================================
- RESOURCE Controllers -
===================================================
*/

//RESOURCE GET REQUEST
resourceController.getConfig = {



  handler: function (request, reply) {

    //getResourcesJSON();

    if (request.params.id) {
        if ((numRes <= request.params.id - 1) || (0 > request.params.id - 1)) {
          //return reply('Not enough resources in the database for your request').code(404);
          return reply(Boom.notFound("Index out of range for Resources get request"));
        }
        //if (resources.length <= request.params.id - 1) return reply('Not enough resources in the database for your request').code(404);
        var actualIndex = Number(request.params.id -1 );  

        //create new object, convert to json
        var str = formatResource(actualIndex);

        return reply(str);


      //return reply(resources[actualId]);
    }

    //if no ID specified
    var objToReturn = [];

    for(var i=0; i < resources.length; i++) {
      var bob = formatResource(i);
      objToReturn.push(bob);
    }

    //console.log(objToReturn);

    reply(objToReturn);
  }
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

  handler: function(req, reply) {

  	//getResources();

  	var theResourceID = resources.length+1;
/*
    var theData = {
      name: 			    req.payload.title,
      website: 			  req.payload.url,
      author: 			  req.payload.author,

      parent: 			  req.payload.parent,

      description: 		req.payload.description,
      categories: 		req.payload.categories,
      topic: 			    req.payload.topic,
      accompaniment: 	req.payload.accompaniment,
      languages: 		  req.payload.languages,
      ensembles : 		req.payload.ensembles,
      ethnicities : 	req.payload.ethnicities,
      hymn_soc_member:req.payload.hymn_soc_member,
      is_free: 			  req.payload.is_free
      //city: 			req.payload.city,
      //state: 			req.payload.state,
      //country: 			req.payload.country

    };
*/
    //console.log("\nRECEIVED :", req.payload.data);

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
      is_active:        req.payload.data.is_active,
      user_id:          req.payload.uid,
      user:             req.payload.user,
      pract_schol:      req.payload.data.pract_schol,

      categories:       req.payload.data.categories,
      topics:            req.payload.data.topics,
      accompaniment:    req.payload.data.accompaniment,
      languages:        req.payload.data.languages,
      ensembles:        req.payload.data.ensembles,
      ethnicities:      req.payload.data.ethnicities,
      tags:             req.payload.data.tags,

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
    handler: function(request, reply) {
        getResourcesJSON();
      	var theResourceID = resources.length+1;

        if (request.params.id) {
            if (numRes <= request.params.id - 1) {
              //return reply('Not enough resources in the database for your request').code(404);
              return reply(Boom.notFound());
            }
            //if (resources.length <= request.params.id - 1) return reply('Not enough resources in the database for your request').code(404);
            var actualIndex = Number(request.params.id -1 );  

            var mysqlIndex = Number(request.params.id);

            connection.query(`
            UPDATE resources SET is_active = false
            WHERE id = ${mysqlIndex}`, function(err, rows, fields) {
              if(err) {
                  throw err;
              } else {
                  console.log("set resource #", mysqlIndex, " to innactive (is_active = false)");
              }

              return reply( {code: 200} );
            });

          //return reply(resources[actualId]);
        }


    }
};

//RESOURCE MAKE ACTIVE ENDPOINT
//RESOURCE DELETE ENDPOINT
resourceController.activateConfig = {
    handler: function(request, reply) {
        getResourcesJSON();
      	var theResourceID = resources.length+1;

        if (request.params.id) {
            if (numRes <= request.params.id - 1) {
              //return reply('Not enough resources in the database for your request').code(404);
              return reply(Boom.notFound());
            }
            //if (resources.length <= request.params.id - 1) return reply('Not enough resources in the database for your request').code(404);
            var actualIndex = Number(request.params.id -1 );  //if you request for resources/1 you'll get resources[0]

            var mysqlIndex = Number(request.params.id);

            connection.query(`
            UPDATE resources SET is_active = true
            WHERE id = ${mysqlIndex}`, function(err, rows, fields) {
              if(err) {
                  throw err;
              } else {
                  console.log("set resource #", mysqlIndex, " to active (is_active = true)");
              }

              return reply( {code: 200} );
            });

          //return reply(resources[actualId]);
        }


    }
};



module.exports = [
	{ path: '/resource', method: 'POST', config: resourceController.postConfig },
  { path: '/resource/{id?}', method: 'GET', config: resourceController.getConfig },
  { path: '/resource/{id}', method: 'DELETE', config: resourceController.deleteConfig},
  { path: '/resource/activate/{id}', method: 'PUT', config: resourceController.activateConfig}
];
