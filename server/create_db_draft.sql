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
DROP TABLE IF EXISTS Social_Media_Connections;
DROP TABLE IF EXISTS tags;

DROP TABLE IF EXISTS Event_Table;
DROP TABLE IF EXISTS Congregations;
DROP TABLE IF EXISTS Resources;
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


SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE tags (
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
	cong_id int unsigned auto_increment,
	PRIMARY KEY (cong_id),
	cong_name varchar(64),
	website varchar(64),
	cong_city varchar(64),
	cong_state varchar(64),
	cong_country varchar(64),
	hymn_soc_members boolean default False,
	priest_attire varchar(64),
	avg_attendance float,
	denomination_id int unsigned not null,
	song_types_id int unsigned not null,
	instrument_types_id int unsigned not null,
	worship_types_id int unsigned not null,
	cong_type_id int unsigned not null,
	ethnicity_types_id int unsigned not null,
	FOREIGN KEY (denomination_id)
		REFERENCES Denominations (id),
	FOREIGN KEY (song_types_id)
		REFERENCES Song_Types(id),
	FOREIGN KEY (instrument_types_id)
		REFERENCES Instrument_Types(id),
	FOREIGN KEY (worship_types_id)
		REFERENCES Worship_Types(id),
	FOREIGN KEY (cong_type_id)
		REFERENCES Cong_Type(id),
	FOREIGN KEY (ethnicity_types_id)
		REFERENCES Ethnicities(id)
	
	
);

CREATE TABLE event_table(
	event_id int unsigned auto_increment,
	PRIMARY KEY(event_id),
	event_title varchar(128),
	website varchar(128),
	theme_or_topic varchar(128),
	event_desc text(256),
	event_start_date date,
	event_start_time time,
	event_end_date date,
	event_end_time time,
	registration_cost int unsigned default 0,
	event_city varchar(64),
	event_state varchar(32),
	event_country text,
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
	link varchar(128),
	author_id int unsigned,
	description text(512),
	type_id int unsigned,
	tag_id int unsigned,
	denomination_id int unsigned,
	Resource_date timestamp,
	favorites int unsigned,
	views int unsigned,
	parent_org_id int unsigned,
	language_id int unsigned, 
	is_free boolean,
	instrument_type_id int unsigned,
	topic_id int unsigned,
	ensemble_id int unsigned,
	ethnicity_id int unsigned,
	hymn_soc_member_included boolean,
	
	FOREIGN KEY (author_id) REFERENCES Authors(id),
	FOREIGN KEY (type_id) REFERENCES Resource_Types(id),
	FOREIGN KEY (tag_id) REFERENCES tags(tag_id),
	FOREIGN KEY (denomination_id) REFERENCES Denominations(id),
	FOREIGN KEY (parent_org_id) REFERENCES Parent_Org(id),
	FOREIGN KEY (language_id) REFERENCES Languages(id),
	FOREIGN KEY (instrument_type_id) REFERENCES Instrument_Types(id),
	FOREIGN KEY (topic_id) REFERENCES Topics(id),
	FOREIGN KEY (ensemble_id) REFERENCES Ensembles(id),
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
	PRIMARY KEY (user_id)
    /* keep track of their quizes */
  
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
		REFERENCES tags (tag_id),
	text_field varchar(512) /*if 'other' is selected */
);


CREATE TABLE Social_Media_Connections(
	id int unsigned auto_increment,
	name varchar(64),
	PRIMARY KEY (id),
	type varchar(32), 
	link varchar(64),
    user_id int unsigned not null,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
    
);

/* for storing RESOURCES and CONGREGATIONS!!! */

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
    FOREIGN KEY(cong_id) REFERENCES congregations(cong_id),
    PRIMARY KEY(id) 
);

CREATE TABLE event_favorites(
	id int unsigned not null auto_increment,
    user_id int unsigned not null,
	event_id int unsigned not null,
    time_favorited timestamp,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(event_id) REFERENCES event_table(event_id),
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
    FOREIGN KEY(cong_id) REFERENCES congregations(cong_id),
    PRIMARY KEY(id) 

);

CREATE TABLE user_viewed_events(
	id int unsigned not null auto_increment,
    user_id int unsigned not null,
    event_id int unsigned not null,
    time_begin timestamp,
	numViews int unsigned not null default 0,
    FOREIGN KEY(user_id) REFERENCES users(user_id),
    FOREIGN KEY(event_id) REFERENCES event_table(event_id),
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



