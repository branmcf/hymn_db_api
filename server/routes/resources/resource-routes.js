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

resourceController = {};
var resources = [];
  var numRes = 0;
  var resTypes = [];
  var resTopics =[];
  var resAcc = [];
  var resTags = [];
  var resEth = [];
  var resAcc = [];

getResources();



function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}

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
}//end getInter function

//get Resources
function getResources() {
  //get RESOURCES from db
  connection.query(`SELECT * from resources`, function(err, rows, fields) {
            //need type, topics, accompaniment, tags, ethnicities
    if (!err) {
    	console.log("got a resource");

      	var JSObj = rowsToJS(rows);       
      
      	resources.push(JSObj);

      	numRes = resources[0].length;

/* 
===================================================
- MIDDLE TABLES -
=================================================== 
*/
    getInter("Resource_Types",  "resources", "resource_resource_types", "resource_type_id", "resource_id", resTypes, numRes);
    getInter("Topics",          "resources", "resource_topics",         "topic_id", "resource_id", resTopics, numRes);
    getInter("Tags",            "resources", "resource_tags",           "tag_id", "resource_id", resTags, numRes);
    getInter("Ethnicities",     "resources", "resource_ethnicities",    "ethnicity_id", "resource_id", resEth, numRes);
    getInter("Accompaniment", 	"resources", "resource_accompaniment", 	"accompaniment_id", "resource_id", resAcc, numRes);
      
    }
    else
      console.log('Error while performing Resources Query.');

  });
}

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
    accompaniment: 	resAcc[actualIndex],
    //tags
    tags:           resTags[actualIndex],
    is_active:      resources[0][actualIndex].is_active,
    high_level:     resources[0][actualIndex].high_level,
    city:        resources[0][actualIndex].city,
    state:       resources[0][actualIndex].state,
    country:     resources[0][actualIndex].country,
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

    //console.log(objToReturn);
    
    reply(objToReturn);
  }
};

//RESOURCE POST REQUEST
resourceController.postConfig = {
	auth: {
  		mode: 'try'
  	},

  handler: function(req, reply) {

  	var theResourceID = resources.length+1;

    var theData = { 
      title: 			req.payload.title, 
      website: 			req.payload.url, 
      //author: 			req.payload.author,
      //parent: req.payload.parent,
      description: 		req.payload.description,
      //categories: req.payload.categories,
      //topic: 			req.payload.topic,
      //accompaniment: 	req.payload.accompaniment,
      //languages: 		req.payload.languages,
      //ensembles : 		req.payload.ensembles,
      ethnicities : 	req.payload.ethnicities,
      hymn_soc_member: 	req.payload.hymn_soc_member,
      is_free: 			req.payload.is_free,
      city: 			req.payload.city,				
      state: 			req.payload.state,
      country: 			req.payload.country

    };


  	var newRes = {
  		type: "Resource",
  		user: "Person Submitting...",
  		uid: resources[0].length + 1,
  		data: theData		
  	};

    /*
	//NOW FORMAT DATA FOR THE RIGHT TABLES
    */

    //1. Resources Table
    //now delete rows for db entry
	var toDb = theData;
	delete toDb.ethnicities; 

    var query = connection.query('INSERT INTO resources SET ?', 
		theData, function (err, rows) {
			if(err) { throw new Error(err); return; }
					
	});
    //2. Categories Table && resource_resource_types Table
    //3. Topics Table && resource_topics Table
    //4. Accompaniment Table && resource_accompaniment Table
    //5. Languages Table
    //6. Ensembles Table
    //7. Ethnicities Table
    	//get id of the ethnicities
    	var ethIDs = [];

    	for(var i = 0; i < newRes.data.ethnicities.length; i++) {
    		//console.log(theData.ethnicities[i].name);
    		connection.query('SELECT id from Ethnicities WHERE name = ?', 
    		newRes.data.ethnicities[i].name, function (err, rows) {
    			if(err) { throw new Error(err); return; }

    			ethIDs.push(rows[0].id);
    			console.log(ethIDs[i]);	
    			middleTables(i);
    		});
    	};//end for loop

    	function middleTables(i) {
    		var bob = {resource_id: theResourceID,ethnicity_id: ethIDs[i]};
    		for(var i = 0; i < ethIDs.length; i++) {
	    		var query = connection.query('INSERT INTO resource_ethnicities SET ?', 
					bob, function (err, rows) {
					if(err) { throw new Error(err); return; }
					console.log(query.sql);
					
				});
    		}
    	};
    	
    	
		
		   

    // mysql
    //connection.connect();
    connection.query(
      'INSERT INTO resources SET ?', toDb,
      function(err, rows) {
        if(err) {
          throw new Error(err);
          return;
        }

        resources[0].push(newRes);

        //getResources();

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
      title: Joi.string().required(),
      website: Joi.string().required(),
      description: Joi.string().required(),
      ethnicities: Joi.array().sparse()
      //is_free: Joi.string().required()
    }
  }

};


module.exports = [
	{ path: '/resource', method: 'POST', config: resourceController.postConfig },
  	{ path: '/resource/{id?}', method: 'GET', config: resourceController.getConfig }
];
