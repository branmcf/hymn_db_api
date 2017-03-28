var Hapi = require('hapi');
var Bcrypt = require('bcryptjs');
var Boom = require('boom');
var Joi = require('joi');
var mysql = require('mysql');
var async = require('async');
const fs = require('fs');
var BasicAuth = require('hapi-auth-basic')
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

connection.connect();

//to be used at the end of the file for exporting the handlers
var quizController = {};
var quizAnswers = [];

var getUserAnswers = function(err, data) {
	
};

//================================================================

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
}

//RESOURCE GET REQUEST
var getAnswersController = require('../../controllers/get-answers').getAnswers;

var getRecResourcesController = require('../../controllers/get-rec-resources').getRecRes;

var postQuizController = require('../../controllers/post-quiz').postQuiz;


/*
================================================== 
BELOW: RECOMMENDATIONS!
==================================================
*/



module.exports = [
	  { path: '/quiz', method: 'POST', config: postQuizController },
  	{ path: '/quiz/{id?}', method: 'GET', config: getAnswersController },
  	{ path: '/quiz/rec/{id}', method: 'GET', config: getRecResourcesController}
  	//{ path: '/quiz/{id}', method: 'PUT', config: quizController.updateConfig}
];
