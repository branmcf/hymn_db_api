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

personController = {};
var persons = [];
var personNumPersons = 0;
  var personTopics, personTopics_all = [];
  var personEnsembles, personEnsembles_all = [];
  var personEthnicities, personEthnicities_all = [];
  var personInstruments, personInstruments_all = [];
  var personCategories, personCategories_all = [];
  var personTags, personTags_all = [];
  var personLangs, personLangs_all = [];


getPersonsJSON();



function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}



function getPersonsJSON() {
  //console.log("===== GETTING PERSONS =====");
  connection.query(`SELECT * from persons`, function(err, rows, fields) {
    if (!err) {

      	var JSObj = rowsToJS(rows);

        persons = [];
        personTopics = [];
        personEnsembles = [];
        personEthnicities = [];
        personInstruments = [];
        personCategories = [];
        personTags = [];
        personLangs = [];


        persons = JSObj;

      	numPersons = persons.length;

        //console.log("\nT: ", rows[0]);
        for(var i=0; i<JSObj.length; i++) { 
          popArray(JSObj[i]["ethnicities"], personEthnicities);
          popArray(JSObj[i]["categories"], personCategories);
          popArray(JSObj[i]["topics"], personTopics);
          popArray(JSObj[i]["ensembles"], personEnsembles);
          popArray(JSObj[i]["tags"], personTags);
          popArray(JSObj[i]["instruments"], personInstruments);
          popArray(JSObj[i]["languages"], personLangs);

          //console.log("\nETH[",i, "] : ", resEth[i]);
          //console.log("\nCAT[",i, "] : ", resCategories[i]);
          //console.log("\nTOPICS[",i, "] : ", resTopics[i]);
          //console.log("\nACC[",i, "] : ", resAcc[i]);
          //console.log("\nLANG[",i, "] : ", resLanguages[i]);
          //console.log("\nENSEMBLES[",i, "] : ", resEnsembles[i]);
          //console.log("\nresTags[",i, "] : ", resTags[i]);

          personEthnicities_all.push(personEthnicities);
            personCategories_all.push(personCategories);
            personTopics_all.push(personTopics);
            personEnsembles_all.push(personEnsembles);
            personTags_all.push(personTags);
            personInstruments_all.push(personInstruments);
            personLangs_all.push(personLangs);
        }

    }
    else
      console.log('Error while performing Persons Query.');

  });
}//end func


function popArray(obj, whichArray) {
  
  obj = JSON.parse(obj);
  if(obj == null ) { 
    whichArray.push([]);
    return; 
  }
  var theKeys = [];

  if(obj[0] !== undefined) { 
    for(i in obj) {
      theKeys.push(obj[i]);
    }
    whichArray.push(theKeys);    
    return;
  }

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


function insertPerson(theObj) {

  var justPerson = JSON.parse(JSON.stringify(theObj));

  justPerson.categories = JSON.stringify(justPerson.categories);
  justPerson.topics = JSON.stringify(justPerson.topics);
  justPerson.ethnicities = JSON.stringify(justPerson.ethnicities);
  justPerson.tags = JSON.stringify(justPerson.tags);
  justPerson.ensembles = JSON.stringify(justPerson.ensembles);
  justPerson.instruments = JSON.stringify(justPerson.instruments);
  justPerson.languages = JSON.stringify(justPerson.languages);

  //console.log("\n\njustPerson: \n\n", justPerson);

  // TYPE CONVERSION
  if(typeof justPerson.hymn_soc_member == "string") {
    if(justPerson.hymn_soc_member == "no" || justPerson.hymn_soc_member == "No") {
      justPerson.hymn_soc_member = false;
    } else {
      justPerson.hymn_soc_member = true;
    }
  } else if(typeof justPerson.hymn_soc_member == "number") {
    if(justPerson.hymn_soc_member == 0) {
      justPerson.hymn_soc_member = false;
    } else {
      justPerson.hymn_soc_member = true;
    }
  } else {
    //neither a string nor Number
    justPerson.hymn_soc_member = false;
  }


  // END TYPE CONVERSION

	connection.query(`INSERT INTO persons set ?`, justPerson, function(err, rows, fields) {
        if(err) { throw err; }

        var JSObj = rowsToJS(theObj);
        persons.push(JSObj);  
    });
}

/*
===================================================
- PERSON Controllers -
===================================================
*/



function formatPerson(actualIndex) {
  var personData = {};

  personData = {
    id:             persons[actualIndex].id,
    first_name:     persons[actualIndex].first_name,
    last_name:      persons[actualIndex].last_name,
    email:          persons[actualIndex].email,
    city:           persons[actualIndex].city,
    state:          persons[actualIndex].state,
    country:        persons[actualIndex].country,
    url:            persons[actualIndex].website,
    social_facebook:persons[actualIndex].social_facebook,
    social_twitter: persons[actualIndex].social_twitter,
    social_other:   persons[actualIndex].social_other,
    emphasis:       persons[actualIndex].emphasis,
    hymn_soc_member:persons[actualIndex].hymn_soc_member,
    high_level:     persons[actualIndex].high_level,
    is_active:      persons[actualIndex].is_active,
    approved:       persons[actualIndex].approved,
    user_id:        persons[actualIndex].user_id,
    user:           persons[actualIndex].user,
    pract_schol:    persons[actualIndex].pract_schol,

    languages:      personLangs_all[0][actualIndex],
    instruments:    personInstruments_all[0][actualIndex],
    categories:     personCategories_all[0][actualIndex],
    ensembles:      personEnsembles_all[0][actualIndex],
    ethnicities:    personEthnicities_all[0][actualIndex],
    topics:         personTopics_all[0][actualIndex],
    tags:           personTags_all[0][actualIndex]
    
  };

  personData.hymn_soc_member = reformatTinyInt(personData.hymn_soc_member);
  personData.is_active = reformatTinyInt(personData.is_active);
  personData.high_level = reformatTinyInt(personData.high_level);
  personData.approved = reformatTinyInt(personData.approved);

  var theUrl = "/person/" + String(persons[actualIndex].id);

  var finalObj = {
    url: theUrl,
    data: personData
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



//PERSON GET REQUEST
personController.getConfig = {

  handler: function (request, reply) {

    getPersonsJSON();

    //console.log("\n\nETHS[", persons.length-1, "] => ",personEthnicities[persons.length-1]);

    if (request.params.id) {
        if ((numPersons <= request.params.id - 1) || (0 > request.params.id - 1)) {
          //return reply('Not enough Persons in the database for your request').code(404);
          return reply(Boom.notFound("Index out of range for Persons get request"));
        }
        var actualIndex = Number(request.params.id -1 );  

        //create new object, convert to json
        
        if(persons[actualIndex].approved == 0) {
          var str = formatPerson(actualIndex);
          return reply(str);
        } else {
          return reply(Boom.badRequest("The Person you request is already approved"));
        }
        
        
      //return reply(persons[actualId]);
    }

    //if no ID specified
    var objToReturn = [];

    for(var i=0; i < persons.length; i++) {
      //var bob = formatResource(i);
      
      if(persons[i].approved == 0) {
        var str = {
          id:     persons[i].id,
          user:   persons[i].user,
          first_name:  persons[i].first_name,
          last_name:  persons[i].last_name

        }
        objToReturn.push(str);
      } 
    }//end for

    //console.log(objToReturn);
    if(objToReturn.length <= 0) {
      return reply(Boom.badRequest("All resources already approved, nothing to return"));
    } else {
      reply(objToReturn);
    }
  }
};



//PERSON POST REQUEST
personController.postConfig = {
  //auth: 'high_or_admin',
  handler: function(req, reply) {

  	//getPersonsJSON();

  	var thePersonID = persons.length+1;

    var theData = {
      first_name:             req.payload.data.first_name,
      last_name:             req.payload.data.last_name,
      email:          req.payload.data.email,
      city:           req.payload.data.city,
      state:           req.payload.data.state,
      country:      req.payload.data.country,
      website:          req.payload.data.url,
      social_facebook:          req.payload.data.social_facebook,
      social_twitter:          req.payload.data.social_twitter,
      social_other:          req.payload.data.social_other,
      emphasis:       req.payload.data.emphasis,
      hymn_soc_member:  req.payload.data.hymn_soc_member,     
      high_level:       req.payload.data.high_level,
      user_id:          req.payload.uid,
      user:             req.payload.user,
      is_active:        true,
      pract_schol:      req.payload.data.pract_schol,
      
      languages:        req.payload.data.languages,
      instruments:      req.payload.data.instruments,
      categories:       req.payload.data.categories,
      ensembles:        req.payload.data.ensembles,
      ethnicities:      req.payload.data.ethnicities,
      topics:           req.payload.data.topics,
      tags:             req.payload.data.tags

    };

    insertPerson(theData);
    getPersonsJSON();

    var toReturn = {

    	person_id: thePersonID /* +1 or not?... */

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
      parent: 	Joi.string().allow(''),
      hymn_soc_member: Joi.string().allow('')

    }
  }
*/
};

//delete
personController.deleteConfig = {
  //auth: 'admin_only',
  handler: function(req, reply) {
      var query = connection.query(`DELETE FROM persons WHERE id=${req.params.id}`, function(err, rows, fields) {
        if(err) { return reply(Boom.badRequest("error when deleting from persons")); }
        return reply ({ 
          code: 202,
          message: `Successfully deleted persons with id=${req.params.id}`
        });
      });
  }//end handler
};

personController.updateConfig = {
  //auth: 'admin_only',
  handler: function(request, reply) {
    getPersonsJSON();
    var thePersonID = persons.length+1;

    if (request.params.id) {
        if (numPersons <= request.params.id - 1) {
          //return reply('Not enough events in the database for your request').code(404);
          return reply(Boom.notFound("Not enough persons"));
        }
        //if (events.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);
        var actualIndex = Number(request.params.id -1 );  //if you request for events/1 you'll get events[0]

        var mysqlIndex = Number(request.params.id);

        var theCol = request.payload.column;
        var theVal = request.payload.value;

        if(theCol == "id") { return reply(Boom.unauthorized("cannot change that..."));}

        var query = connection.query(`
        UPDATE persons SET ?
        WHERE ?`, [{ [theCol]: theVal}, {id: mysqlIndex}],function(err, rows, fields) {
          if(err) {
              console.log(query.sql);
              return reply(Boom.badRequest(`invalid query when updating persons on column ${request.payload.what_var} with value = ${request.payload.what_val} `));
          } else {
            getPersonsJSON();
            console.log(query.sql);
            console.log("set person #", mysqlIndex, ` variable ${theCol} = ${theVal}`);
          }

          return reply( {statusCode: 200} );
        });

      //return reply(persons[actualId]);
    }
  }//handler
}

//PERSON GET REQUEST
personController.getApprovedConfig = {

  handler: function (request, reply) {

    connection.query(`SELECT * from persons`, function(err, rows, fields) {
      if (!err) {
          var JSObj = rowsToJS(rows);
          persons = [];
          personTopics = [];
          personEnsembles = [];
          personEthnicities = [];
          personInstruments = [];
          personCategories = [];
          personTags = [];
          personLangs = [];
          persons = JSObj;
          numPersons = persons.length;
          //console.log("\nT: ", rows[0]);
          for(var i=0; i<JSObj.length; i++) { 
            popArray(JSObj[i]["ethnicities"], personEthnicities);
            popArray(JSObj[i]["categories"], personCategories);
            popArray(JSObj[i]["topics"], personTopics);
            popArray(JSObj[i]["ensembles"], personEnsembles);
            popArray(JSObj[i]["tags"], personTags);
            popArray(JSObj[i]["instruments"], personInstruments);
            popArray(JSObj[i]["languages"], personLangs);

            personEthnicities_all.push(personEthnicities);
            personCategories_all.push(personCategories);
            personTopics_all.push(personTopics);
            personEnsembles_all.push(personEnsembles);
            personTags_all.push(personTags);
            personInstruments_all.push(personInstruments);
            personLangs_all.push(personLangs);
          }

      }
      else {
        return reply(Boom.badRequest()); 
      }

      //console.log("\n\nETHS[", persons.length-1, "] => ",personEthnicities[persons.length-1]);

      if (request.params.id) {
          if ((numPersons <= request.params.id - 1) || (0 > request.params.id - 1)) {
            //return reply('Not enough Persons in the database for your request').code(404);
            return reply(Boom.notFound("Index out of range for Persons get request"));
          }
          var actualIndex = Number(request.params.id -1 );  

          //create new object, convert to json
          
          if(persons[actualIndex].approved == 1) {
            var str = formatPerson(actualIndex);
            return reply(str);
          } else {
            return reply(Boom.badRequest("The Person you request is already approved"));
          }
          
          
        //return reply(persons[actualId]);
      }

      //if no ID specified
      var objToReturn = [];

      for(var i=0; i < persons.length; i++) {
        //var bob = formatResource(i);
        
        if(persons[i].approved == 1) {
          var str = formatPerson(i);
          objToReturn.push(str);
        } 
      }//end for

      //console.log(objToReturn);
      if(objToReturn.length <= 0) {
        return reply(Boom.badRequest("All resources already approved, nothing to return"));
      } else {
        reply(objToReturn);
      }
    });
  }
};

personController.editConfig = {
//auth: 'high_or_admin',
  handler: function(req, reply) {

    var theData = {
      first_name:             req.payload.data.first_name,
      last_name:             req.payload.data.last_name,
      email:          req.payload.data.email,
      city:           req.payload.data.city,
      state:           req.payload.data.state,
      country:      req.payload.data.country,
      website:          req.payload.data.url,
      social_facebook:          req.payload.data.social_facebook,
      social_twitter:          req.payload.data.social_twitter,
      social_other:          req.payload.data.social_other,
      emphasis:       req.payload.data.emphasis,
      hymn_soc_member:  req.payload.data.hymn_soc_member,     
      high_level:       req.payload.data.high_level,
      user_id:          req.payload.uid,
      user:             req.payload.user,
      is_active:        true,
      pract_schol:      req.payload.data.pract_schol,
      
      approved:         false,
      languages:        req.payload.data.languages,
      instruments:      req.payload.data.instruments,
      categories:       req.payload.data.categories,
      ensembles:        req.payload.data.ensembles,
      ethnicities:      req.payload.data.ethnicities,
      topics:           req.payload.data.topics,
      tags:             req.payload.data.tags

    };

    var justPerson = JSON.parse(JSON.stringify(theObj));

    justPerson.categories = JSON.stringify(justPerson.categories);
    justPerson.topics = JSON.stringify(justPerson.topics);
    justPerson.ethnicities = JSON.stringify(justPerson.ethnicities);
    justPerson.tags = JSON.stringify(justPerson.tags);
    justPerson.ensembles = JSON.stringify(justPerson.ensembles);
    justPerson.instruments = JSON.stringify(justPerson.instruments);
    justPerson.languages = JSON.stringify(justPerson.languages);

    // TYPE CONVERSION
    if(typeof justPerson.hymn_soc_member == "string") {
      if(justPerson.hymn_soc_member == "no" || justPerson.hymn_soc_member == "No") {
        justPerson.hymn_soc_member = false;
      } else {
        justPerson.hymn_soc_member = true;
      }
    } else if(typeof justPerson.hymn_soc_member == "number") {
      if(justPerson.hymn_soc_member == 0) {
        justPerson.hymn_soc_member = false;
      } else {
        justPerson.hymn_soc_member = true;
      }
    } else {
      //neither a string nor Number
      justPerson.hymn_soc_member = false;
    }

    //if (events.length <= request.params.id - 1) return reply('Not enough events in the database for your request').code(404);

    if(theCol == "id") { return reply(Boom.unauthorized("cannot change that..."));}

    var query = connection.query(`
    UPDATE persons SET ?
    WHERE ?`, [ justPerson, {id: req.params.id}],function(err, rows, fields) {
      if(err) {
          console.log(query.sql);
          return reply(Boom.badRequest(`invalid query when updating persons with id = ${req.payload.id} `));
      } else {
        getPersonsJSON();
        console.log(query.sql);
        console.log("set person #", req.params.id);
      }

      return reply( {statusCode: 201} );
    });

    

    

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
      parent: 	Joi.string().allow(''),
      hymn_soc_member: Joi.string().allow('')

    }
  }
*/

}





module.exports = [
	{ path: '/person', method: 'POST', config: personController.postConfig },
  { path: '/person/{id?}', method: 'GET', config: personController.getConfig },
  { path: '/person/approved/{id?}', method: 'GET', config: personController.getApprovedConfig },
  { path: '/person/{id}', method: 'DELETE', config: personController.deleteConfig },
  { path: '/person/{id}', method: 'PUT', config: personController.editConfig},
  { path: '/person/update/{id}', method: 'PUT', config: personController.updateConfig}
  
];
