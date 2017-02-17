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
  var personTopics = [];
  var personEnsembles = [];
  var personEthnicities =[];
  var personInstruments = [];
  var personCategories = [];

getPersonsJSON();


function rowsToJS(theArray) {
  var temp = JSON.stringify(theArray);
  temp = JSON.parse(temp);
  //console.log(temp);
  return temp;
}
)

/*
===================================================
- PERSON Controllers -
===================================================
*/

function formatPerson(actualIndex) {
  var personData = {};

  personData = {
    id:             persons[0][actualIndex].id,
    first_name:     persons[0][actualIndex].first_name,
    last_name:      persons[0][actualIndex].last_name,
    email:          persons[0][actualIndex].email,
    city:           persons[0][actualIndex].city,
    state:          persons[0][actualIndex].state,
    country:        persons[0][actualIndex].country,
    url:            persons[0][actualIndex].website,
    social_facebook:persons[0][actualIndex].social_facebook,
    social_twitter: persons[0][actualIndex].social_twitter,
    social_other:   persons[0][actualIndex].social_other,
    emphasis:       persons[0][actualIndex].emphasis,
    hymn_soc_member:persons[0][actualIndex].hymn_soc_member,
    topics:         personTopics[actualIndex],
    ensembles:      personEnsembles[actualIndex],
    ethnicities:    personEthnicities[actualIndex],
    categories:     personCategories[actualIndex],
    instruments:    personInstruments[actualIndex],
    user_id:        persons[0][actualIndex].user_id,
    user:           persons[0][actualIndex].user


  };

  var theUrl = "/person/" + String(actualIndex+1);

  var finalObj = {
    url: theUrl,
    data: personData
  };

  //var str = JSON.stringify(finalObj);

  return finalObj;


}

//RESOURCE GET REQUEST
personController.getConfig = {

  handler: function (request, reply) {

    getPersons();

    //console.log("\n\nETHS[", persons[0].length-1, "] => ",personEthnicities[persons[0].length-1]);

    if (request.params.id) {
        if ((numPersons <= request.params.id - 1) || (0 > request.params.id - 1)) {
          //return reply('Not enough resources in the database for your request').code(404);
          return reply(Boom.notFound("Index out of range for Persons get request"));
        }
        //if (resources.length <= request.params.id - 1) return reply('Not enough resources in the database for your request').code(404);
        var actualIndex = Number(request.params.id -1 );  //if you request for resources/1 you'll get resources[0]

        //create new object, convert to json
        var str = formatPerson(actualIndex);

        return reply(str);

      //return reply(resources[actualId]);
    }

    //if no ID specified
    var objToReturn = [];

    for(var i=0; i < persons[0].length; i++) {
      var temp = formatPerson(i);
      objToReturn.push(temp);
    }

    return reply(objToReturn);
  }
};

//RESOURCE POST REQUEST
personController.postConfig = {

  handler: function(req, reply) {

  	getPersons();

  	var thePersonID = persons.length;
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
      //city: 			req.payload.city,
      //state: 			req.payload.state,
      //country: 			req.payload.country

    };
*/
    //console.log("\nRECEIVED :", req.payload.data);

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
      topics:    req.payload.data.topics,
      ensembles:        req.payload.data.ensembles,
      ethnicities:      req.payload.data.ethnicities,
      user_id:          req.payload.uid,
      user:             req.payload.user,
      
      instruments:      req.payload.data.instruments,
      categories:       req.payload.data.categories

    };

    insertPerson(theData);

    var toReturn = {

    	person_id: persons[0].length +1 /* +1 or not?... */

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
    { path: '/person/{id?}', method: 'GET', config: personController.getConfig },
  //{ path: '/resource/{id}', method: 'DELETE', config: resourceController.deleteConfig},
  //{ path: '/resource/activate/{id}', method: 'PUT', config: resourceController.activateConfig}
];
