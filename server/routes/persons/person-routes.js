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
  var numPersons = 0;

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

        persons = JSObj;

      	numPersons = persons.length;

    }
    else
      console.log('Error while performing Persons Query.');

  });
}//end func



function insertPerson(theObj) {

  var justPerson = JSON.parse(JSON.stringify(theObj));

  justPerson.categories = JSON.stringify(justPerson.categories);
  justPerson.topics = JSON.stringify(justPerson.topics);
  justPerson.ethnicities = JSON.stringify(justPerson.ethnicities);
  justPerson.tags = JSON.stringify(justPerson.tags);
  justPerson.ensembles = JSON.stringify(justPerson.ensembles);
  justPerson.instruments = JSON.stringify(justPerson.instruments);

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
    user_id:        persons[actualIndex].user_id,
    user:           persons[actualIndex].user,

    instruments:    persons[actualIndex].instruments,
    categories:     persons[actualIndex].categories,
    ensembles:      persons[actualIndex].ensembles,
    ethnicities:    persons[actualIndex].ethnicities,
    topics:         persons[actualIndex].topics,
    tags:           persons[actualIndex].tags
    
  };

  var theUrl = "/person/" + String(actualIndex+1);

  var finalObj = {
    url: theUrl,
    data: personData
  };

  //var str = JSON.stringify(finalObj);

  return finalObj;


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
        
        if(persons[actualIndex].approved == false || persons[actualIndex].approved == 0) {
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
      if(persons[i].approved == false || persons[i].approved == 0) {
        var str = {
          id:     persons[i].id,
          user:   persons[i].user,
          first_name:  persons[i].first_name,
          first_name:  persons[i].last_name

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
      hymn_soc_member:            req.payload.data.hymn_soc_member,     
      user_id:          req.payload.uid,
      user:             req.payload.user,
      
      instruments:      req.payload.data.instruments,
      categories:       req.payload.data.categories,
      ensembles:        req.payload.data.ensembles,
      ethnicities:      req.payload.data.ethnicities,
      topics:           req.payload.data.topics,
      tags:             req.payload.data.tags

    };

    insertPerson(theData);

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





module.exports = [
	{ path: '/person', method: 'POST', config: personController.postConfig },
    { path: '/person/{id?}', method: 'GET', config: personController.getConfig }
  
];
