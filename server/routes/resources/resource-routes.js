var Joi = require('joi')
var mysql = require('mysql')

//mysql connection
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123',
  database : 'testDb'
});

resourceController = {};
var resources = [];
  var numRes = 0;
  var resTypes = [];
  var resTopics =[];
  var resAcc = [];
  var resTags = [];
  var resEth = [];

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
  connection.query(`SELECT 
          id, 
          title,
          website,
          resource_date,
          description,
          is_active,
          high_level,
          city_id,
          state_id,
          country_id,
          hymn_soc_member,        
          parent_org_id,
          is_free
          from resources`, function(err, rows, fields) {
            //need type, topics, accompaniment, tags, ethnicities
    if (!err) {

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
    //accompaniment (????????)
    //tags
    tags:           resTags[actualIndex],
    is_active:      resources[0][actualIndex].is_active,
    high_level:     resources[0][actualIndex].high_level,
    city_id:        resources[0][actualIndex].city_id,
    state_id:       resources[0][actualIndex].state_id,
    country_id:     resources[0][actualIndex].country_id,
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

    console.log(objToReturn);
    
    reply(objToReturn);
  }
};

//RESOURCE POST REQUEST
resourceController.postConfig = {
  handler: function(req, reply) {
    var newRes = { 
      title: req.payload.title, 
      link: req.payload.link, 
      description: req.payload.description,
      is_free: req.payload.is_free
    };

    // mysql
    //connection.connect();
    connection.query(
      'INSERT INTO resources SET ?', newRes,
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

    resources.push(newRes);
    //reply(newRes);
  },
  validate: {
    payload: {
      title: Joi.string().required(),
      link: Joi.string().required(),
      description: Joi.string().required(),
      is_free: Joi.string().required()
    }
  }

};


module.exports = [
	{ path: '/resource', method: 'POST', config: resourceController.postConfig },
  	{ path: '/resource/{id?}', method: 'GET', config: resourceController.getConfig }
];
