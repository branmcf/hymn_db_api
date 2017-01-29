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
if (process.env.JAWSDB_URL) {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
}

connection.connect();

congController = {};
var congs = [];
  var numCongs = 0;
  var congDen = [];
  var congCategories = [];
  var congInstr = [];
  var congEth = [];
  var congTags = [];

getCongregations();

function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}

function getCongregations() {
  //get congregations from db
  connection.query('SELECT * from congregations', function(err, rows, fields) {
    if (!err) {
    
      var JSObj = rowsToJS(rows);       
      congs.push(JSObj);
      numCongs = congs[0].length;

      getInter("Denominations", 	"congregations", "congregation_denominations", 		"denomination_id", 		"congregation_id", congDen, numCongs);
      getInter("Cong_Types",    	"congregations", "congregation_types" ,				"congregation_type_id", "congregation_id", congCategories, numCongs);
      getInter("Instrument_Types", 	"congregations", "congregation_instrument_types", 	"instrument_type_id", 	"congregation_id", congInstr, numCongs);
      getInter("Ethnicities",  		"congregations", "congregation_ethnicities",  		"ethnicity_id", 			"congregation_id", congEth, numCongs);
      getInter("Tags", 				"congregations", "congregation_tags", 				"tag_id", 				"congregation_id", congTags, numCongs);



    }
    else
      console.log('Error while performing Congregations Query.');

  });
}//end getCongregations function


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
- CONGREGATION Controllers -
=================================================== 
*/

function formatCongregation(actualIndex) {
  var congData = {};

  congData = {
    id:             congs[0][actualIndex].id, 
    name:          congs[0][actualIndex].name,
    url:            congs[0][actualIndex].website,
    //denominations
    denominations:  congDen[actualIndex],
    city:        congs[0][actualIndex].city,
    state:       congs[0][actualIndex].state,
    country:     congs[0][actualIndex].country,
    hymn_soc_member:congs[0][actualIndex].hymn_soc_member,
    //categories
    categories:     congCategories[actualIndex],
    //instruments
    instruments:    congInstr[actualIndex],
    shape:          congs[0][actualIndex].shape,
    clothing:       congs[0][actualIndex].clothing,
    geography:      congs[0][actualIndex].geographic_area,
    //ethnicities
    ethnicities:    congEth[actualIndex],
    //tags
    tags:           congCategories[actualIndex],
    is_active:      congs[0][actualIndex].is_active,
    high_level:     congs[0][actualIndex].high_level

  };

  var theUrl = "/congregation/" + String(actualIndex+1);

  var finalObj = {
    url: theUrl,
    data: congData
  };

  return finalObj;
}

//CONG GET REQUEST
congController.getConfig = {
  handler: function (request, reply) {
    if (request.params.id) {
      //if (resources.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);      //
      var actualIndex = Number(request.params.id) - 1;
      //create new object, convert to json
      var finalObj = formatCongregation(actualIndex);

      console.log("eyy: ", finalObj);

      return reply(finalObj);
    }
    //if no ID specified
    //reply(JSON.stringify(congs[0]));

    var objToReturn = [];

    for(var i=0; i < congs[0].length; i++) {
      var bob = formatCongregation(i);
      objToReturn.push(bob);
    }
    
    reply(objToReturn);
  }
};

//CONG POST REQUEST
congController.postConfig = {
  handler: function(req, reply) {
    var newCong = { 
      cong_name: req.payload.cong_name, 
      website: req.payload.website, 
      cong_city: req.payload.cong_city,
      cong_state: req.payload.cong_state,
      cong_country: req.payload.cong_country,
      priest_attire: req.payload.priest_attire,
      denomination_id: req.payload.denomination_id,
      song_types_id: req.payload.song_types_id,
      instrument_types_id: req.payload.instrument_types_id,
      worship_types_id: req.payload.worship_types_id,
      ethnicity_types_id: req.payload.ethnicity_types_id,
      cong_type_id: req.payload.cong_type_id
    };

    // mysql
    //connection.connect();
    connection.query(
      'INSERT INTO congregations SET ?', newCong,
      function(err, rows) {
        if(err) {
          throw new Error(err);
          return;
        }

        congs[0].push(newCong);

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
      cong_name: Joi.string().required(),
      website: Joi.string().required(),
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

};


module.exports = [
	{ path: '/congregation', method: 'POST', config: congController.postConfig },
 	{ path: '/congregation/{id?}', method: 'GET', config: congController.getConfig }

];