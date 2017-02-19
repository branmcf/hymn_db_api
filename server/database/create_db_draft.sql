SET FOREIGN_KEY_CHECKS=0;

/*
DROP TABLE IF EXISTS event_table;
DROP TABLE IF EXISTS Event_Table;
*/




DROP TABLE IF EXISTS choices;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS quizes;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS congregations;
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS persons;

SET FOREIGN_KEY_CHECKS=1;

/*
===================================================
- USERS, ORGS, EVENTS, RESOURCES, CONGS -
===================================================
*/


CREATE TABLE users (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	email varchar(128) default null,
	UNIQUE(email),
	password varchar(128) default null,
    salt varchar(128),
    iterations int unsigned,
	first_name varchar(64) default null,
	last_name varchar(64) default null,
	reg_date timestamp,
	is_active boolean default true,
	website varchar(128),
	hymn_soc_member boolean default false,

	approved boolean default false,
	high_level boolean default false,
	is_admin boolean default false,

	ethnicities JSON DEFAULT NULL

);

CREATE TABLE resources (
	id int unsigned auto_increment,
	PRIMARY KEY (id),
	name varchar(128),
	INDEX(name(8)),	
	type varchar(64),
	INDEX(type(6)),
	website varchar(128),
	author varchar(128),
	parent varchar(128),
	description text(1024),
	resource_date timestamp,
	user varchar(64),
    user_id int unsigned,
	hymn_soc_member boolean default false,
	is_free TINYINT(3) default 0,
	pract_schol varchar(32),
	
	city varchar(64) default "Dallas",
	state varchar(64) default "Texas",
	country varchar(128) default "United States",

	is_active boolean default true,
	high_level boolean default false,
	approved boolean default false,
	
	tags json DEFAULT NULL,
	denominations json DEFAULT NULL,
	instruments json DEFAULT NULL,
	topics json DEFAULT NULL,
	ensembles json DEFAULT NULL,
	accompaniment json DEFAULT NULL,
	languages json DEFAULT NULL,
	categories json DEFAULT NULL,
	ethnicities json DEFAULT NULL
    
);

CREATE TABLE events(
	id int unsigned auto_increment,
	PRIMARY KEY(id),
	name varchar(128),
	INDEX(name(8)),
	frequency varchar(64),
	website varchar(128),
	parent varchar(128),
	theme varchar(128), /* aka topic */
	description text(1024),

	event_date DATETIME,
	event_end_date DATETIME,
	
	cost varchar(64) default "$0.00",
	city varchar(64) default "Dallas",
	state varchar(64) default "Texas",
	country varchar(128) default "United States",
	hymn_soc_member boolean default false,
	shape varchar(128),
	priest_attire varchar(64),
	attendance varchar(64),
	user_id int unsigned,
    user varchar(64),
	
	is_free tinyint(3),
	is_active boolean default false,
	high_level boolean default false,
	approved boolean default false,
	pract_schol varchar(32),
    
	tags json DEFAULT NULL,
	ensembles json DEFAULT NULL,
	ethnicities json DEFAULT NULL

);

CREATE TABLE organizations (
	id int unsigned auto_increment,
	PRIMARY KEY (id),
	name varchar(64),
	website varchar(128),
	parent varchar(128),
	denomination varchar(128),
	city varchar(64) default "Dallas",
	state varchar(64) default "Texas",
	country varchar(128) default "United States",
	geography varchar(128),
	is_free TINYINT(3) default 0,
	events_free TINYINT(3) default 0,
	membership_free TINYINT(3) default 0,
	charge decimal(6) default 0.00,
	mission varchar(256),
	process varchar(256),
	hymn_soc_member tinyint(3) default false,
	shape varchar(128),
	priest_attire varchar(64),
	user_id int unsigned,
    user varchar(64),

	promotions varchar(256),
    is_active boolean default false,
    high_level boolean default false,
    clothing varchar(128),
    approved boolean default false,

	categories JSON DEFAULT NULL, 
	instruments JSON DEFAULT NULL, 
	ethnicities JSON DEFAULT NULL,
	tags JSON DEFAULT NULL
    
    

);


CREATE TABLE congregations (
	id int unsigned auto_increment,
	PRIMARY KEY (id),
	name varchar(64),
	website varchar(64),
	denomination varchar(64),
	city varchar(64) default "Dallas",
	state varchar(64) default "Texas",
	country varchar(128) default "United States",
	hymn_soc_member boolean default false,
	shape varchar(128),
	clothing varchar(128),
	geography varchar(128),
	attendance varchar(64) default "under 50",
	is_active boolean default false,
	high_level boolean default false,
	user_id int unsigned,
    user varchar(64),

	priest_attire varchar(64),
	description_of_worship_to_guests text(512),
	is_free TINYINT(3) default 0,
	events_free TINYINT(3) default 0,
	process varchar(128),
	approved boolean default false,

	categories JSON DEFAULT NULL, 
	instruments JSON DEFAULT NULL, 
	ethnicities JSON DEFAULT NULL,
	tags JSON DEFAULT NULL

);

/*
===================================================
- QUIZ TEMPLATES -
===================================================
*/

CREATE TABLE quizes (
	quiz_id int unsigned not null auto_increment,
	quiz_title varchar(512),
	is_active boolean default true,
	start_date timestamp,
	PRIMARY KEY (quiz_id),
	user_id int unsigned,
	FOREIGN KEY(user_id) REFERENCES users (id)
    /* create a quiz when a user is created! */
);



CREATE TABLE questions (
	question_id int unsigned not null auto_increment,
	question_text varchar(512),
	question_weight smallint unsigned default null,
	PRIMARY KEY (question_id),
	quiz_id int unsigned not null,
	FOREIGN KEY (quiz_id) REFERENCES quizes (quiz_id)
);



CREATE TABLE choices (
	choice_id int unsigned not null auto_increment,
	choice_text varchar(512),
	PRIMARY KEY (choice_id),
	question_id int unsigned not null,
	FOREIGN KEY (question_id) REFERENCES questions (question_id),
	/* after modification */
	is_selected boolean default false,
	tags JSON DEFAULT NULL,
	text_field varchar(512) /*if 'other' is selected */
);

CREATE TABLE persons (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	first_name varchar(64),
	last_name varchar(64),
	email varchar(128),
	city varchar(128),
	state varchar(64),
	country varchar(128),
	website varchar(128),
	social_facebook varchar(128),
	social_twitter varchar(128),
	social_other varchar(128),
	emphasis varchar(128),
	hymn_soc_member boolean default false,
	user_id int unsigned,
	user varchar(64),

	approved boolean default false,
	is_active boolean default false,
	high_level boolean default false,

	topics json DEFAULT NULL,
	ensembles json DEFAULT NULL,
	tags json DEFAULT NULL,
	ethnicities json DEFAULT NULL,
	instruments json DEFAULT NULL,
	categories json DEFAULT NULL

);

