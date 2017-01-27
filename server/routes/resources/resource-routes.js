var Joi = require('joi')
var mysql = require('mysql')

//var mysql = require('promise-mysql');

var options = require('../../config/config.js');

//mysql connection
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : options.user,
  password : options.password,
  database : options.database
});




resourceController = {};
var resources = [];
  var numRes = 0;
  //var resTypes = [];
  var resCategories = [];
  var resTopics =[];
  var resAcc = [];
  var resLanguages = [];
  //var resTags = [];
  var resEnsembles = [];
  var resEth = [];



getResources();

function insertResource(theObj) {
	var noEth = JSON.parse(JSON.stringify(theObj));
	
  if(typeof noEth.ethnicities !== "undefined") { delete noEth.ethnicities; }
  if(typeof noEth.categories !== "undefined") { delete noEth.categories; }
	if(typeof noEth.topic !== "undefined") { delete noEth.topic; }
	if(typeof noEth.topics !== "undefined") { delete noEth.topic; }
  if(typeof noEth.accompaniment !== "undefined") { delete noEth.accompaniment; }
  if(typeof noEth.languages !== "undefined") { delete noEth.languages; }
  if(typeof noEth.ensembles !== "undefined") { delete noEth.ensembles; }


	connection.query(`insert into resources set ?`, noEth, function(err, rows, fields) {
        if(err) { throw err; }
        
        var JSObj = rowsToJS(theObj);
        
        resources[0].push(JSObj); 

        //console.log("NOW RESOURCES.LENGTH IS: ", resources[0].length);

        //for multiple ethnicities
        for(var i=0; i< theObj.ethnicities.length; i++) {
        	getID_left(theObj, i, "Ethnicities", "ethnicity_id");   
    	  }

    	//for multiple CATEGORIES
    	for(var i=0; i< theObj.categories.length; i++) {
    		getID_left(theObj, i, "Resource_Categories", "resource_category_id");

    	}

    	//for multiple TOPICS
    	for(var i=0; i< theObj.topic.length; i++) {
    		getID_left(theObj, i, "Topics", "topic_id");

    	}

    	//for multiple Accompaniment
    	for(var i=0; i< theObj.accompaniment.length; i++) {
    		getID_left(theObj, i, "Accompaniment", "accompaniment_id");

    	}

    	//for multiple Ensembles
    	for(var i=0; i< theObj.ensembles.length; i++) {
    		getID_left(theObj, i, "Ensembles", "ensemble_id");

    	}

      for(var i=0; i< theObj.languages.length; i++) {
          getID_left(theObj, i, "Languages", "language_id");   
      }

        //getIDAttribute(theObj, 1);
    });
}

function getID_left(theObj, whichIndex, tableName, left_table_id) {
	console.log("done with insertResource()");

	switch(tableName) {

		case "Ethnicities":
			var attributeName = theObj.ethnicities[whichIndex].name;	
			break;
		case "Resource_Categories": 
			var attributeName = theObj.categories[whichIndex].name;	
			break; 
		case "Categories": 
			var attributeName = theObj.categories[whichIndex].name;	
			break; 
		case "Types": 
			var attributeName = theObj.types[whichIndex].name;	 
			break;
		case "Resource_Types": 
			var attributeName = theObj.types[whichIndex].name;	 
			break;
		case "Ensembles": 
			var attributeName = theObj.ensembles[whichIndex].name;	 
			break;
		case "Denominations": 
			var attributeName = theObj.denominations[whichIndex].name;	 
			break;
		case "Instruments": 
			var attributeName = theObj.instruments[whichIndex].name;	 
			break;
		case "Instrument_Types": 
			var attributeName = theObj.instruments[whichIndex].name;	 
			break;
		case "Topics": 
			var attributeName = theObj.topic[whichIndex].name;	 
			break;
		case "Accompaniment": 
			var attributeName = theObj.accompaniment[whichIndex].name;	 
			break;
		default:
			console.log("INVALID TABLE NAME SENT for ",tableName);
			break;
	}//end switch
	
	console.log("attributeName:", attributeName);

	var mid_table_id = 0;

	//2a
	connection.query(`SELECT id from ${tableName} WHERE name = ?`, 
	attributeName, function (err, rows) {
		if(err) { throw new Error(err); return; }
		mid_table_id = rows[0].id;
		console.log("theID: ",mid_table_id);

    if(mid_table_id != 0) {
		  insertMiddle(mid_table_id, tableName, left_table_id);
    } else {
      console.log("ERROR, NO ROW FOUND IN ", tableName, " with name = ",attributeName);
    }

	});

	
}

function insertMiddle(theID, tableName, left_table_id) {
	//2b. insert into middle table
	//console.log("\nABOUT TO INSERT FOR RESOURCE #", resources[0].length, "\n");
	switch(tableName) {
		case "Ethnicities":
			var midTable = "resource_ethnicities";
			var toInsert = {ethnicity_id: theID,resource_id: resources[0].length};	break;
		case "Resource_Categories": 
			var midTable = "resource_resource_categories";
			var toInsert = {resource_category_id: theID,resource_id: resources[0].length};	break;
		case "Types": 
			var midTable = "resource_resource_types";
			var toInsert = {resource_type_id: theID,resource_id: resources[0].length};	break;
		case "Resource_Types": 
			var midTable = "resource_resource_types";
			var toInsert = {resource_type_id: theID,resource_id: resources[0].length};	break;
		case "Ensembles": 
			var midTable = "resource_ensembles";
			var toInsert = {ensemble_id: theID,resource_id: resources[0].length};	break;
		case "Authors": 
			var midTable = "resource_authors";
			var toInsert = {author_id: theID,resource_id: resources[0].length};	break;
		case "Denominations": 
			var midTable = "resource_denominations";
			var toInsert = {denomination_id: theID,resource_id: resources[0].length};	break;
		case "Instruments": 
			var midTable = "resource_instruments";
			var toInsert = {instrument_type_id: theID,resource_id: resources[0].length};	break;
		case "Instrument_Types": 
			var midTable = "resource_instruments";
			var toInsert = {instrument_type_id: theID,resource_id: resources[0].length};	break;
		case "Topics": 
			var midTable = "resource_topics";
			var toInsert = {topic_id: theID,resource_id: resources[0].length};	break;
		case "Accompaniment": 
			var midTable = "resource_accompaniment";
			var toInsert = {accompaniment_id: theID,resource_id: resources[0].length};	break;
		default:
			console.log("INVALID TABLE NAME SENT for ",tableName);
			break;
	}
	//var toInsert = {ethnicity_id: theID,resource_id: resources[0].length}
	console.log("\nTO INSERT: \n", toInsert);
	var query = connection.query(`INSERT INTO ${midTable} SET ?`, 
	toInsert, function (err, rows) {
		if(err) { throw new Error(err); return; }

		console.log("query: ", query.sql);

	});
}





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
    	console.log("got resources");

      	var JSObj = rowsToJS(rows);       
      
      	resources.push(JSObj);

      	//console.log("resources: ", resources[0]);

      	numRes = resources[0].length;

/* 
===================================================
- MIDDLE TABLES -
=================================================== 
*/
    getInter("Resource_Categories",  "resources", "resource_resource_categories", "resource_category_id", "resource_id", resCategories, numRes);
    getInter("Topics",          "resources", "resource_topics",         "topic_id", "resource_id", resTopics, numRes);
    //getInter("Tags",            "resources", "resource_tags",           "tag_id", "resource_id", resTags, numRes);
    getInter("Ethnicities",     "resources", "resource_ethnicities",    "ethnicity_id", "resource_id", resEth, numRes);
    getInter("Accompaniment", 	"resources", "resource_accompaniment", 	"accompaniment_id", "resource_id", resAcc, numRes);
    getInter("Ensembles",       "resources", "resource_ensembles",  "ensemble_id", "resource_id", resEnsembles, numRes);
    getInter("Languages",       "resources", "resource_languages",  "language_id", "resource_id", resLanguages, numRes);

      
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
    //types:          resTypes[actualIndex],
    url:            resources[0][actualIndex].website,
    resource_date:  resources[0][actualIndex].resource_date,
    description:    resources[0][actualIndex].description,
    parent_org_id:  resources[0][actualIndex].parent_org_id,
    //topics
    topic:         resTopics[actualIndex],
    accompaniment: 	resAcc[actualIndex],
    //tags
    //tags:           resTags[actualIndex],
    categories:     resCategories[actualIndex],
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

  handler: function(req, reply) {

  	getResources();

  	var theResourceID = resources.length+1;

    var theData = { 
      title: 			    req.payload.title, //
      website: 			  req.payload.url,  //
      author: 			  req.payload.author, //
      
      parent: 			  req.payload.parent, //

      description: 		req.payload.description, //
      categories: 		req.payload.categories, /* TAGS */
      topic: 			    req.payload.topic, //
      accompaniment: 	req.payload.accompaniment, //
      languages: 		  req.payload.languages, //
      ensembles : 		req.payload.ensembles, //
      ethnicities : 	req.payload.ethnicities, //
      hymn_soc_member:req.payload.hymn_soc_member, //
      is_free: 			  req.payload.is_free
      //city: 			req.payload.city,				
      //state: 			req.payload.state,
      //country: 			req.payload.country

    };

    console.log("CATEGORIES :", typeof theData.categories);


  	var newRes = {
  		type: "Resource",
  		user: "Person Submitting",
  		uid: resources[0].length + 1,
  		data: theData		
  	};

    /*
	//NOW FORMAT DATA FOR THE RIGHT TABLES
    */

    //insertResource(theData);

    JUSTUGH(theData);


    /*

    addResources(theData);

    function addResources(theObj) {
    	 

		var noEth = JSON.parse(JSON.stringify(theObj));
		delete noEth.ethnicities;
		

    	//1. Insert into resources
    	var query = connection.query('INSERT INTO resources SET ?', 
		noEth, function (err, rows) {
			if(err) { throw new Error(err); return; }

			resources[0].push(newRes);
			
			//2a. get ethnicity ID
			var ethIDs = [];
			for(var i=0; i< theObj.ethnicities.length; i++) {
				var temp = getIDEth(theObj, i);
				console.log("temp: ", temp)
				ethIDs.push(temp);
				console.log("ethIDs[",i,"] = ", ethIDs[i])
			}

			//2b. insert into middle table
			var toInsert = {ethnicity_id: ethIDs[0],resource_id: resources[0].length}
			var query = connection.query(`INSERT INTO resource_ethnicities SET ?`, 
			toInsert, function (err, rows) {
				if(err) { throw new Error(err); return; }

				console.log("query: ", query.sql);

				returnReply();		
		
			});

			
		});//end connection 1
    };

    function getIDEth(theObj, whichIndex, callback) {
    	//console.log("theObj.ethnicities[whichIndex]:", theObj.ethnicities[whichIndex]);

    	var eths = theObj.ethnicities[whichIndex];	
    	//console.log("eths.name:", eths.name);

    	var ethIDs = 0;

    	
		//2a
		connection.query(`SELECT id from ethnicities WHERE name = ?`, 
		eths.name, function (err, rows) {
			if(err) { throw new Error(err); return; }
			ethIDs = rows[0].id;
			console.log("ethIDs: ",ethIDs);

			//return ethIDs;
		});

		if(ethIDs != 0)
			return ethIDs;
		else
			return 1;
	    	

    	//done
    	
    };
    */


    //1. Resources Table
    //now delete rows for db entry
	

    
    //2. Categories Table && resource_resource_types Table
    //3. Topics Table && resource_topics Table
    //4. Accompaniment Table && resource_accompaniment Table
    //5. Languages Table
    //6. Ensembles Table
    //7. Ethnicities Table
    	//get id of the ethnicities
    	/*
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
    	*/
    	
		
		   

    // mysql
    //connection.connect();
/*
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
*/
    //end mysql

    var toReturn = {

    	resource_id: users[0].length
    }
    
    return reply(toReturn);
	
  },
  validate: {
    payload: {
      title: 	Joi.string().required(),
      website: 	Joi.string().required(),
      description: Joi.string().required(),
      author: 	Joi.string().allow(''),

      ethnicities: Joi.object(),
      categories: Joi.object(),
      topic: 	Joi.object(),
      accompaniment: Joi.object(),
      languages: Joi.object(),
      ensembles: Joi.object(),
      //is_free: Joi.string().required()
      parent: 	Joi.string().allow(''),
      hymn_soc_member: Joi.string().allow(''),
      is_free: Joi.string().allow('')

    }
  }

};

function JUSTUGH(theObj) {

	console.log("inserting resource");

	getResources();

	var noEth = JSON.parse(JSON.stringify(theObj));
	delete noEth.ethnicities;
	//delete noEth.author;
	//delete noEth.parents;
	delete noEth.categories;
	delete noEth.topic;
	delete noEth.accompaniment;
	delete noEth.languages;
	delete noEth.ensembles;


	connection.query(`insert into resources set ?`, noEth, function(err, rows, fields) {
        if(err) { throw err; }
        
        console.log(query.sql);

        var JSObj = rowsToJS(theObj);
        
        resources[0].push(JSObj); 
    });
}


module.exports = [
	{ path: '/resource', method: 'POST', config: resourceController.postConfig },
  	{ path: '/resource/{id?}', method: 'GET', config: resourceController.getConfig }
];
