"use strict";

var Hapi = require('hapi');
var Bcrypt = require('bcryptjs');
var Boom = require('boom');
var Joi = require('joi');
var mysql = require('mysql');
var async = require('async');
const fs = require('fs');
var BasicAuth = require('hapi-auth-basic');
var options = require('../../config/config.js');


//mysql connection
var connection = mysql.createConnection({
    host: options.host,
    user: options.user,
    password: options.password,
    database: options.database,
    port: options.port

});

if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL);
}

connection.connect();

//pass in a type (resource vs cong vs event etc.) with the actual object
//if a match is found, a match wil be returned, otherwise a 0 will be returned
//an error will be returned if an error is encountered
module.exports = function(which_table, resource, callback) {
    //columns_to_check has attributes shared by all except persons
    var columns_to_check = ["name", "website", "parent", "city", "state"];
    var defining_columns = [];
    switch (which_table) {
        case "resources":
            {
                columns_to_check.push("type", "author");
                defining_columns = [
                    ["type", "author"]
                    ["city", "state"]
                ];
                break;
            }
        case "events":
            {
                columns_to_check.push("type", "theme", "event_date", "event_end_date");
                defining_columns = [
                    ["parent", "theme"]
                    ["city", "state"]
                ];
                break;
            }
        case "organizations":
            {
                columns_to_check.push("denomination", "mission", "process");
                defining_columns = [
                    ["parent", "denomination"]
                    ["city", "state"]
                ];
                break;
            }
        case "congregations":
            {
                columns_to_check.push("denomination", "process");
                defining_columns = [
                    ["denomination", "process"]
                    ["city", "state"]
                ];
                break;
            }
        case "persons":
            {
                columns_to_check = ["city", "state", "first_name", "last_name", "email", "website", "social_facebook", "social_twitter", "social_other"];
                defining_columns = ["social_facebook", "social_twitter", "social_other", ["first_name", "last_name"],
                    ["city", "state"]
                ];
                break;
            }
        default:
            {
                return Boom.badData("which_table is invalid in check-for-duplicates");
            };
    } //end switch statement

    //now get all approved resources in the Db to compare to...
    var query = connection.query(`SELECT 
			id, ${columns_to_check}
			FROM ${which_table} WHERE approved = 1`, (err, rows, fields) => {
        if (err) { return callback(err, null); }
        if (rows.length <= 0) { return callback(true, null); }
        var all_resources = rowsToJS(rows);

        //resource(passed in this function's parameter) is the 'resource' that we will use to compare previous entries to,
        //in order to find a possible duplicate
        var matches_found = {};
        /*
        Structure of matches_found:
        {
            "resource_id" : ["column_name", "column_name", "column_name"],
            "resource_id" : ["column_name"],
            ...        
        }

        */

        //loop through each existing resource
        for (var resource_index in all_resources) {
            for (var column_index in columns_to_check) {
                let current_column = columns_to_check[column_index]
                if (all_resources[resource_index][current_column] == resource[current_column]) {

                    //see if this resource's id exists in matches_found already...
                    if (all_resources[resource_index]["id"] in matches_found) {
                        matches_found[all_resources[resource_index]["id"]] = [current_column];
                    } else {
                        //if it already exists, just increment it...
                        matches_found[all_resources[resource_index]["id"]].push(current_column);
                    }
                }
            }
        }

        //now loop through each KEY (which is a resource id) in matches_found and cross reference with defining_columns...
        //if there are matches, then there is likely a duplicate resource...
        for (var found_key in matches_found) {
            for (var defining_index in defining_columns) {
                if (matches_found.hasOwnProperty(found_key)) {
                    if (matches_found[found_key] == defining_columns[defining_index]) {
                        //match found... :O
                        //trigger some function or callback that would return an indication that there might be a duplicate present...
                    }
                }
            }
        }


        return callback(null, toReturn);
    });

}