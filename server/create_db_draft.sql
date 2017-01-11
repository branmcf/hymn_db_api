SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS user_viewed_events;
DROP TABLE IF EXISTS user_viewed_congs;
DROP TABLE IF EXISTS user_viewed_resources;
DROP TABLE IF EXISTS resource_favorites;
DROP TABLE IF EXISTS cong_favorites;
DROP TABLE IF EXISTS event_favorites;
DROP TABLE IF EXISTS choices;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS quizes;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS social_media_connections;
DROP TABLE IF EXISTS Tags;

DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS congregations;
DROP TABLE IF EXISTS Resources;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS Ensembles;
DROP TABLE IF EXISTS Topics;
DROP TABLE IF EXISTS Languages;
DROP TABLE IF EXISTS Resource_Tags;
DROP TABLE IF EXISTS Resource_Types;
DROP TABLE IF EXISTS Authors;

DROP TABLE IF EXISTS Ethnicities;
DROP TABLE IF EXISTS Cong_Type;
DROP TABLE IF EXISTS Worship_Types;
DROP TABLE IF EXISTS Instrument_Types;
DROP TABLE IF EXISTS Song_Types;
DROP TABLE IF EXISTS Denominations;
DROP TABLE IF EXISTS Event_Types;
DROP TABLE IF EXISTS Parent_Org;

DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS states;
DROP TABLE IF EXISTS countries;


SET FOREIGN_KEY_CHECKS=1;



CREATE TABLE cities(
	id int unsigned not null auto_increment,
	name varchar(64),
	PRIMARY KEY (id)
);
CREATE TABLE states(
	id int unsigned not null auto_increment,
	name varchar(64),
	PRIMARY KEY (id)
);
CREATE TABLE countries(
	id int unsigned not null auto_increment,
	name varchar(64),
	PRIMARY KEY (id)
);



CREATE TABLE Tags (
	tag_id int unsigned not null auto_increment,
	tag_name varchar(128),
	PRIMARY KEY (tag_id)
	/* maybe link to other tables like congregation types? */
);

CREATE TABLE Authors (
	id int unsigned auto_increment,
	name varchar(128), 
	PRIMARY KEY (id),
	website varchar(128),
	email varchar(64)
);

CREATE TABLE Resource_Types (
	id int unsigned auto_increment,
	name varchar(128), 
	PRIMARY KEY (id)
);

/*
CREATE TABLE Resource_Tags (
	id int unsigned auto_increment,
	name varchar(128), 
	PRIMARY KEY (id)
);
*/

CREATE TABLE Languages (
	id int unsigned auto_increment,
	name varchar(128), 
	PRIMARY KEY (id)
);

CREATE TABLE Topics (
	id int unsigned auto_increment,
	name varchar(128), 
	PRIMARY KEY (id)
);

CREATE TABLE Ensembles (
	id int unsigned auto_increment,
	name varchar(128), 
	PRIMARY KEY (id)
);

CREATE TABLE Parent_Org (
	id int unsigned auto_increment,
	name varchar(128), 
	PRIMARY KEY (id)
);
	
CREATE TABLE Event_Types (
	id int unsigned auto_increment,
	name varchar(64),
	PRIMARY KEY (id)
);

CREATE TABLE Denominations (
	id int unsigned auto_increment,
	name varchar(64),
	PRIMARY KEY (id)
);

CREATE TABLE Song_Types (
	id int unsigned auto_increment,
	name varchar(64),
	PRIMARY KEY (id)
);

CREATE TABLE Instrument_Types (
	id int unsigned auto_increment,
	name varchar(64),
	PRIMARY KEY (id)
);

CREATE TABLE Worship_Types (
	id int unsigned auto_increment,
	name varchar(64),
	PRIMARY KEY (id)
);

CREATE TABLE Cong_Type (
	id int unsigned auto_increment,
	name varchar(64),
	PRIMARY KEY (id)
);

CREATE TABLE Ethnicities (
	id int unsigned auto_increment,
	name varchar(64),
	PRIMARY KEY (id)
);



CREATE TABLE congregations (
	id int unsigned auto_increment,
	PRIMARY KEY (id),
	name varchar(64),
	website varchar(64),
	city_id int unsigned,
	state_id int unsigned,
	country_id int unsigned,
	FOREIGN KEY (city_id)
		REFERENCES cities (id),
	FOREIGN KEY (state_id)
		REFERENCES states (id),
	FOREIGN KEY (country_id)
		REFERENCES countries (id),
	hymn_soc_members boolean default False,
	priest_attire varchar(64),
	avg_attendance float,
	denomination_id int unsigned not null,
	song_type_id int unsigned not null,
	instrument_type_id int unsigned not null,
	worship_type_id int unsigned not null,
	cong_type_id int unsigned not null,
	ethnicity_type_id int unsigned not null,
	description_of_worship_to_guests varchar(256),
	size int(10) unsigned default 0,
	FOREIGN KEY (denomination_id)
		REFERENCES Denominations (id),
	FOREIGN KEY (song_type_id)
		REFERENCES Song_Types(id),
	FOREIGN KEY (instrument_type_id)
		REFERENCES Instrument_Types(id),
	FOREIGN KEY (worship_type_id)
		REFERENCES Worship_Types(id),
	FOREIGN KEY (cong_type_id)
		REFERENCES Cong_Type(id),
	FOREIGN KEY (ethnicity_type_id)
		REFERENCES Ethnicities(id)
	
	
);

CREATE TABLE events(
	id int unsigned auto_increment,
	PRIMARY KEY(id),
	event_title varchar(128),
	website varchar(128),
	meeting_frequency varchar(64),
	theme varchar(128),
	event_desc text(256),
	event_start_date date,
	event_start_time time,
	event_end_date date,
	event_end_time time,
	registration_cost int unsigned default 0,
	city_id int unsigned,
	state_id int unsigned,
	country_id int unsigned,
	FOREIGN KEY (city_id)
		REFERENCES cities (id),
	FOREIGN KEY (state_id)
		REFERENCES states (id),
	FOREIGN KEY (country_id)
		REFERENCES countries (id),
	hymn_soc_member_involved boolean default False,
	parent_org_id int unsigned,
	FOREIGN KEY (parent_org_id)
		REFERENCES Parent_Org (id),
	event_type_id int unsigned,
	FOREIGN KEY (event_type_id)
		REFERENCES Event_Types(id)
		
);

CREATE TABLE resources (
	id int unsigned auto_increment,
	PRIMARY KEY (id),
	title varchar(128),
	website varchar(128),
	author_id int unsigned,
	description text(512),
	resource_type_id int unsigned,
	tag_id int unsigned,
	denomination_id int unsigned,
	Resource_date timestamp,
	favorites int unsigned,
	views int unsigned,
	parent_org_id int unsigned,
	language_id int unsigned, 
	instrument_type_id int unsigned,
	topic_id int unsigned,
	ensemble_id int unsigned,
	ethnicity_id int unsigned,
	hymn_soc_member_included boolean,
	is_free boolean,
	
	FOREIGN KEY (author_id) REFERENCES Authors(id),
	FOREIGN KEY (resource_type_id) REFERENCES Resource_Types(id),
	FOREIGN KEY (tag_id) REFERENCES Tags(tag_id),
	FOREIGN KEY (denomination_id) REFERENCES Denominations(id),
	FOREIGN KEY (parent_org_id) REFERENCES Parent_Org(id),
	FOREIGN KEY (language_id) REFERENCES Languages(id),
	FOREIGN KEY (instrument_type_id) REFERENCES Instrument_Types(id),
	FOREIGN KEY (topic_id) REFERENCES Topics(id),
	FOREIGN KEY (ensemble_id) REFERENCES Ensembles(id),
	FOREIGN KEY (ethnicity_id) REFERENCES Ethnicities(id)

);

CREATE TABLE organizations (
	id int unsigned auto_increment,
	PRIMARY KEY (id),
	name varchar(64),
	congregation_id int unsigned,
	FOREIGN KEY (congregation_id) REFERENCES congregations(id),
	website varchar(128),
	parent_org_id int unsigned,
	FOREIGN KEY (parent_org_id) REFERENCES Parent_Org(id),
	denomination_id int unsigned,
	FOREIGN KEY (denomination_id) REFERENCES Denominations(id),
	city_id int unsigned,
	state_id int unsigned,
	country_id int unsigned,
	FOREIGN KEY (city_id)
		REFERENCES cities (id),
	FOREIGN KEY (state_id)
		REFERENCES states (id),
	FOREIGN KEY (country_id)
		REFERENCES countries (id),
	/* CHANGE BELOW TO ANOTHER TABLE LATER */
	geographic_area_description varchar(128),
	is_free tinyint(1) default 0,
	offers_free_events tinyint(1) default 0,
	charge decimal(6) default 0.00,
	mission varchar(256),
	promotions varchar(256),
	song_type_id int unsigned,
	FOREIGN KEY (song_type_id) REFERENCES Song_Types(id),
	instrument_type_id int unsigned,
	FOREIGN KEY (instrument_type_id) REFERENCES Instrument_Types(id),
	worship_type_id int unsigned,
	FOREIGN KEY (worship_type_id) REFERENCES Worship_Types(id),
	priest_attire varchar(64),
	ethnicity_id int unsigned,
	FOREIGN KEY (ethnicity_id) REFERENCES Ethnicities(id)
);

/* now for users and quizes */



CREATE TABLE users (
	user_id int unsigned not null auto_increment,
	email varchar(128) default null,
	password varchar(128) default null,
	first_name varchar(64) default null,
	last_name varchar(64) default null,
	reg_date timestamp,
	is_active tinyint(1) default 1,
	high_level tinyint(1) default 0,
	city_id int unsigned,
	state_id int unsigned,
	country_id int unsigned,
	FOREIGN KEY (city_id)
		REFERENCES cities (id),
	FOREIGN KEY (state_id)
		REFERENCES states (id),
	FOREIGN KEY (country_id)
		REFERENCES countries (id),
	PRIMARY KEY (user_id),
	website varchar(128),
	hymn_soc_member boolean default False,
	ethnicity_id int unsigned,
	FOREIGN KEY (ethnicity_id) REFERENCES Ethnicities(id)

  
);

CREATE TABLE quizes (
	quiz_id int unsigned not null auto_increment,
	quiz_title varchar(512),
	is_active tinyint(1) default 1,
	PRIMARY KEY (quiz_id),
	user_id int unsigned not null,
	FOREIGN KEY (user_id) REFERENCES users (user_id)
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
	FOREIGN KEY (question_id)
		REFERENCES questions (question_id),
	/* after modification */
	is_selected tinyint(1) default 0,
	tag_id int unsigned,
	FOREIGN KEY (tag_id)
		REFERENCES Tags (tag_id),
	text_field varchar(512) /*if 'other' is selected */
);


CREATE TABLE social_media_connections(
	id int unsigned auto_increment,
	name varchar(64),
	PRIMARY KEY (id),
	type varchar(32), 
	link varchar(64),
    user_id int unsigned not null,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    
);

/* for storing RESOURCES and congregations!!! */

CREATE TABLE resource_favorites(
	id int unsigned not null auto_increment,
    user_id int unsigned not null,
	resource_id int unsigned not null,
    time_favorited timestamp,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(resource_id) REFERENCES resources(id),
    PRIMARY KEY(id) 

);

CREATE TABLE cong_favorites(
	id int unsigned not null auto_increment,
    user_id int unsigned not null,
	cong_id int unsigned not null,
    time_favorited timestamp,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(cong_id) REFERENCES congregations(id),
    PRIMARY KEY(id) 
);

CREATE TABLE event_favorites(
	id int unsigned not null auto_increment,
    user_id int unsigned not null,
	event_id int unsigned not null,
    time_favorited timestamp,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(event_id) REFERENCES events(id),
    PRIMARY KEY(id) 
);

/* for storing what the user has viewed */

CREATE TABLE user_viewed_resources(
	id int unsigned not null auto_increment,
    user_id int unsigned not null,
    resource_id int unsigned not null,
    time_begin timestamp,
    numViews int unsigned not null default 0,
	FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(resource_id) REFERENCES resources(id),
    PRIMARY KEY(id) 
    
);

CREATE TABLE user_viewed_congs(
	id int unsigned not null auto_increment,
    user_id int unsigned not null,
    cong_id int unsigned not null,
    time_begin timestamp,
	numViews int unsigned not null default 0,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(cong_id) REFERENCES congregations(id),
    PRIMARY KEY(id) 

);

CREATE TABLE user_viewed_events(
	id int unsigned not null auto_increment,
    user_id int unsigned not null,
    event_id int unsigned not null,
    time_begin timestamp,
	numViews int unsigned not null default 0,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(event_id) REFERENCES events(id),
    PRIMARY KEY(id) 
);

/*
CREATE TABLE user_questions_not_selected (
	user_id int unsigned not null,
	FOREIGN KEY (user_id)
		REFERENCES users (user_id),
	question_id int unsigned not null,
	FOREIGN KEY (question_id)
		REFERENCES questions (question_id),
	choice_id int unsigned not null,
	FOREIGN KEY (choice_id)
		REFERENCES questions_choices (choice_id)
);
*/

/*
//If this table is going to be used, modify questions_choices

CREATE TABLE user_questions_answer (
	time_start timestamp,
	user_id int unsigned not null,
	FOREIGN KEY (user_id)
		REFERENCES users (user_id),
	question_id int unsigned not null,
	FOREIGN KEY (question_id)
		REFERENCES questions (question_id),
	choice_id int unsigned not null,
	FOREIGN KEY (choice_id)
		REFERENCES questions_choices(choice_id)
);



