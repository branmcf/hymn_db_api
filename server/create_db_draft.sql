SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS congregation_tags;
DROP TABLE IF EXISTS congregation_denominations;
DROP TABLE IF EXISTS congregation_song_types;
DROP TABLE IF EXISTS congregation_instrument_types;
DROP TABLE IF EXISTS congregation_worship_types;
DROP TABLE IF EXISTS congregation_types;
DROP TABLE IF EXISTS congregation_ethnicities;
DROP TABLE IF EXISTS event_tags;
DROP TABLE IF EXISTS event_event_types; 
DROP TABLE IF EXISTS resource_tags; 
DROP TABLE IF EXISTS resource_authors; 
DROP TABLE IF EXISTS resource_resource_types;
DROP TABLE IF EXISTS resource_denominations;
DROP TABLE IF EXISTS resource_instruments;
DROP TABLE IF EXISTS resource_topics;
DROP TABLE IF EXISTS resource_ensembles;
DROP TABLE IF EXISTS resource_ethnicities; 
DROP TABLE IF EXISTS organization_tags; 
DROP TABLE IF EXISTS organization_song_types;
DROP TABLE IF EXISTS organization_instrument_types;
DROP TABLE IF EXISTS organization_worship_types;
DROP TABLE IF EXISTS organization_ethnicities;
DROP TABLE IF EXISTS organization_congregations;
DROP TABLE IF EXISTS organization_denominations;

DROP TABLE IF EXISTS user_viewed_events;
DROP TABLE IF EXISTS user_viewed_congs;
DROP TABLE IF EXISTS user_viewed_resources;
DROP TABLE IF EXISTS resource_favorites;
DROP TABLE IF EXISTS cong_favorites;
DROP TABLE IF EXISTS event_favorites;

DROP TABLE IF EXISTS resource_tags;
DROP TABLE IF EXISTS congregation_tags;
DROP TABLE IF EXISTS event_tags;
DROP TABLE IF EXISTS organization_tags;

DROP TABLE IF EXISTS user_choices;
DROP TABLE IF EXISTS user_questions;
DROP TABLE IF EXISTS user_quizes;

DROP TABLE IF EXISTS suggested_congregations;
DROP TABLE IF EXISTS suggested_organizations;
DROP TABLE IF EXISTS suggested_events;
DROP TABLE IF EXISTS suggested_resources;

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
DROP TABLE IF EXISTS Resource_Types;
DROP TABLE IF EXISTS Authors;

DROP TABLE IF EXISTS Ethnicities;
DROP TABLE IF EXISTS Cong_Types;
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

/* 
===================================================
- ATTRIBUTE TABLES -
=================================================== 
*/

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
	id int unsigned not null auto_increment,
	tag_name varchar(128),
	PRIMARY KEY (id)
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

CREATE TABLE Cong_Types (
	id int unsigned auto_increment,
	name varchar(64),
	PRIMARY KEY (id)
);

CREATE TABLE Ethnicities (
	id int unsigned auto_increment,
	name varchar(64),
	PRIMARY KEY (id)
);

/* 
===================================================
- USERS, ORGS, EVENTS, RESOURCES, CONGS -
=================================================== 
*/

CREATE TABLE congregations (
	id int unsigned auto_increment,
	PRIMARY KEY (id),
	name varchar(64),
	website varchar(64),
	city_id int unsigned,
	state_id int unsigned,
	country_id int unsigned,
	FOREIGN KEY (city_id) REFERENCES cities (id),
	FOREIGN KEY (state_id) REFERENCES states (id),
	FOREIGN KEY (country_id) REFERENCES countries (id),
	hymn_soc_members boolean default False,
	priest_attire varchar(64),
	avg_attendance float,
	description_of_worship_to_guests varchar(256),
	size int(10) unsigned default 0
	/*
	denomination_id int unsigned,
	song_type_id int unsigned,
	instrument_type_id int unsigned,
	worship_type_id int unsigned,
	cong_type_id int unsigned,
	ethnicity_type_id int unsigned,
	parent_org_id int unsigned,
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
		REFERENCES Ethnicities(id),
	FOREIGN KEY (parent_org_id)
		REFERENCES Parent_Org(id)
	*/
	
);

CREATE TABLE events(
	id int unsigned auto_increment,
	PRIMARY KEY(id),
	title varchar(128),
	website varchar(128),
	frequency varchar(64),
	theme varchar(128),
	description varchar(512),
	event_date date,
	event_start_time time,

	event_end_date date,
	event_end_time time,
	cost int unsigned default 0,
	hymn_soc_member boolean default False,
	city_id int unsigned,
	state_id int unsigned,
	country_id int unsigned,
	FOREIGN KEY (city_id) REFERENCES cities (id),
	FOREIGN KEY (state_id) REFERENCES states (id),
	FOREIGN KEY (country_id) REFERENCES countries (id),
	parent_org_id int unsigned,
	FOREIGN KEY (parent_org_id) REFERENCES Parent_Org (id),
	is_active boolean default False,
	high_level boolean default False
	
	/*
	event_type_id int unsigned,
	FOREIGN KEY (event_type_id)
		REFERENCES Event_Types(id)
	*/	
);

CREATE TABLE resources (
	id int unsigned auto_increment,
	PRIMARY KEY (id),
	title varchar(128),
	website varchar(128),
	hymn_soc_member boolean default False,
	is_free boolean default False,
	description text(512),
	favorites int unsigned,
	views int unsigned,
	resource_date timestamp,
	
	high_level boolean default False,

	city_id int unsigned,
	state_id int unsigned,
	country_id int unsigned,
	FOREIGN KEY (city_id) REFERENCES cities(id),
	FOREIGN KEY (state_id) REFERENCES states(id),
	FOREIGN KEY (country_id) REFERENCES countries(id),
	parent_org_id int unsigned,
	FOREIGN KEY (parent_org_id) REFERENCES Parent_Org(id)
	/*
	author_id int unsigned,
	resource_type_id int unsigned,
	denomination_id int unsigned,	
	language_id int unsigned, 
	instrument_type_id int unsigned,
	topic_id int unsigned,
	ensemble_id int unsigned,
	ethnicity_id int unsigned,
	FOREIGN KEY (author_id) REFERENCES Authors(id),
	FOREIGN KEY (resource_type_id) REFERENCES Resource_Types(id),
	FOREIGN KEY (denomination_id) REFERENCES Denominations(id),
	FOREIGN KEY (language_id) REFERENCES Languages(id),
	FOREIGN KEY (instrument_type_id) REFERENCES Instrument_Types(id),
	FOREIGN KEY (topic_id) REFERENCES Topics(id),
	FOREIGN KEY (ensemble_id) REFERENCES Ensembles(id),
	FOREIGN KEY (ethnicity_id) REFERENCES Ethnicities(id)
	*/
);

CREATE TABLE organizations (
	id int unsigned auto_increment,
	PRIMARY KEY (id),
	name varchar(64),
	website varchar(128),
	city_id int unsigned,
	state_id int unsigned,
	country_id int unsigned,
	FOREIGN KEY (city_id) REFERENCES cities (id),
	FOREIGN KEY (state_id) REFERENCES states (id),
	FOREIGN KEY (country_id) REFERENCES countries (id),
	parent_org_id int unsigned,
	FOREIGN KEY (parent_org_id) REFERENCES Parent_Org(id),
	/* CHANGE BELOW TO ANOTHER TABLE LATER */
	geographic_area_description varchar(128),
	is_free boolean default False,
	offers_free_events boolean default False,
	charge decimal(6) default 0.00,
	mission varchar(256),
	promotions varchar(256),
	priest_attire varchar(64)
	/*
	congregation_id int unsigned,
	FOREIGN KEY (congregation_id) REFERENCES congregations(id),
	denomination_id int unsigned,
	FOREIGN KEY (denomination_id) REFERENCES Denominations(id),
	song_type_id int unsigned,
	FOREIGN KEY (song_type_id) REFERENCES Song_Types(id),
	instrument_type_id int unsigned,
	FOREIGN KEY (instrument_type_id) REFERENCES Instrument_Types(id),
	worship_type_id int unsigned,
	FOREIGN KEY (worship_type_id) REFERENCES Worship_Types(id),
	ethnicity_id int unsigned,
	FOREIGN KEY (ethnicity_id) REFERENCES Ethnicities(id)
	*/
);

CREATE TABLE users (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	salt varchar(128) default "wtfdyjfsamylb69420",
	email varchar(128) default null,
	password varchar(128) default null,
	first_name varchar(64) default null,
	last_name varchar(64) default null,
	reg_date timestamp,
	is_active boolean default True,
	high_level boolean default False,
	city_id int unsigned,
	state_id int unsigned,
	country_id int unsigned,
	FOREIGN KEY (city_id) REFERENCES cities (id),
	FOREIGN KEY (state_id) REFERENCES states (id),
	FOREIGN KEY (country_id) REFERENCES countries (id),
	website varchar(128),
	hymn_soc_member boolean default False
	/*
	ethnicity_id int unsigned,
	FOREIGN KEY (ethnicity_id) REFERENCES Ethnicities(id)
	*/
  
);

/* 
===================================================
- INTERMEDIATE TABLES FOR CONGREGATIONS -
=================================================== 
*/

CREATE TABLE congregation_tags (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	congregation_id int unsigned,
	FOREIGN KEY (congregation_id) REFERENCES congregations (id),
	tag_id int unsigned,
	FOREIGN KEY (tag_id) REFERENCES Tags (id)
);

CREATE TABLE congregation_denominations (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	congregation_id int unsigned,
	FOREIGN KEY (congregation_id) REFERENCES congregations (id),
	denomination_id int unsigned,
	FOREIGN KEY (denomination_id) REFERENCES Denominations (id)
);

CREATE TABLE congregation_song_types (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	congregation_id int unsigned,
	FOREIGN KEY (congregation_id) REFERENCES congregations (id),
	song_type_id int unsigned,
    FOREIGN KEY (song_type_id) REFERENCES Song_Types (id)
);

CREATE TABLE congregation_instrument_types (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	congregation_id int unsigned,
	FOREIGN KEY (congregation_id) REFERENCES congregations (id),
	instrument_type_id int unsigned,
	FOREIGN KEY (instrument_type_id) REFERENCES Instrument_Types (id)
);

CREATE TABLE congregation_worship_types (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	congregation_id int unsigned,
	FOREIGN KEY (congregation_id) REFERENCES congregations (id),
	worship_type_id int unsigned,
	FOREIGN KEY (worship_type_id) REFERENCES Worship_Types (id)
);

CREATE TABLE congregation_types (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	congregation_id int unsigned,
	FOREIGN KEY (congregation_id) REFERENCES congregations (id),
	congregation_type_id int unsigned,
	FOREIGN KEY (congregation_type_id) REFERENCES Cong_Types (id)
);

CREATE TABLE congregation_ethnicities (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	congregation_id int unsigned,
	FOREIGN KEY (congregation_id) REFERENCES congregations (id),
	ethnicity_id int unsigned,
	FOREIGN KEY (ethnicity_id) REFERENCES Ethnicities (id)
);
/* 
===================================================
- INTERMEDIATE TABLES FOR EVENTS -
=================================================== 
*/

CREATE TABLE event_tags (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	event_id int unsigned,
	FOREIGN KEY (event_id) REFERENCES events (id),
	tag_id int unsigned,
	FOREIGN KEY (tag_id) REFERENCES Tags (id)
);

CREATE TABLE event_event_types (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	event_id int unsigned,
	FOREIGN KEY (event_id) REFERENCES events (id),
	event_type_id int unsigned,
	FOREIGN KEY (event_type_id) REFERENCES Event_Types (id)
);

/* 
===================================================
- INTERMEDIATE TABLES FOR RESOURCES -
=================================================== 
*/

CREATE TABLE resource_tags (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	resource_id int unsigned,
	FOREIGN KEY (resource_id) REFERENCES resources (id),
	tag_id int unsigned,
	FOREIGN KEY (tag_id) REFERENCES Tags (id)
);

CREATE TABLE resource_authors (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	event_id int unsigned,
	FOREIGN KEY (event_id) REFERENCES events (id),
	author_id int unsigned,
	FOREIGN KEY (author_id) REFERENCES Authors (id)
);

CREATE TABLE resource_resource_types (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	event_id int unsigned,
	FOREIGN KEY (event_id) REFERENCES events (id),
	resource_type_id int unsigned,
	FOREIGN KEY (resource_type_id) REFERENCES Resource_Types (id)
);

CREATE TABLE resource_denominations (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	event_id int unsigned,
	FOREIGN KEY (event_id) REFERENCES events (id),
	denomination_id int unsigned,
	FOREIGN KEY (denomination_id) REFERENCES Denominations (id)
);

CREATE TABLE resource_instruments (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	event_id int unsigned,
	FOREIGN KEY (event_id) REFERENCES events (id),
	instrument_type_id int unsigned,
	FOREIGN KEY (instrument_type_id) REFERENCES Instrument_Types (id)
);

CREATE TABLE resource_topics (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	event_id int unsigned,
	FOREIGN KEY (event_id) REFERENCES events (id),
	topic_id int unsigned,
	FOREIGN KEY (topic_id) REFERENCES Topics (id)
);

CREATE TABLE resource_ensembles (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	event_id int unsigned,
	FOREIGN KEY (event_id) REFERENCES events (id),
	ensemble_id int unsigned,
	FOREIGN KEY (ensemble_id) REFERENCES Ensembles (id)
);

CREATE TABLE resource_ethnicities (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	event_id int unsigned,
	FOREIGN KEY (event_id) REFERENCES events (id),
	ethnicity_id int unsigned,
	FOREIGN KEY (ethnicity_id) REFERENCES Ethnicities (id)
);

/* 
===================================================
- INTERMEDIATE TABLES FOR ORGANIZATIONS -
=================================================== 
*/

CREATE TABLE organization_tags (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	organization_id int unsigned,
	FOREIGN KEY (organization_id) REFERENCES organizations (id),
	tag_id int unsigned,
	FOREIGN KEY (tag_id) REFERENCES Tags (id)
);

CREATE TABLE organization_song_types (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	organization_id int unsigned,
	FOREIGN KEY (organization_id) REFERENCES organizations (id),
	song_type_id int unsigned,
	FOREIGN KEY (song_type_id) REFERENCES Song_Types (id)
);

CREATE TABLE organization_instrument_types (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	organization_id int unsigned,
	FOREIGN KEY (organization_id) REFERENCES organizations (id),
	instrument_type_id int unsigned,
	FOREIGN KEY (instrument_type_id) REFERENCES Instrument_Types (id)
);

CREATE TABLE organization_worship_types (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	organization_id int unsigned,
	FOREIGN KEY (organization_id) REFERENCES organizations (id),
	worship_type_id int unsigned,
	FOREIGN KEY (worship_type_id) REFERENCES Worship_Types (id)
);

CREATE TABLE organization_ethnicities (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	organization_id int unsigned,
	FOREIGN KEY (organization_id) REFERENCES organizations (id),
	ethnicity_id int unsigned,
	FOREIGN KEY (ethnicity_id) REFERENCES Ethnicities (id)
);

CREATE TABLE organization_congregations (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	organization_id int unsigned,
	FOREIGN KEY (organization_id) REFERENCES organizations (id),
	congregation_id int unsigned,
	FOREIGN KEY (congregation_id) REFERENCES congregations (id)
);

CREATE TABLE organization_denominations (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	organization_id int unsigned,
	FOREIGN KEY (organization_id) REFERENCES organizations (id),
	denomination_id int unsigned,
	FOREIGN KEY (denomination_id) REFERENCES Denominations (id)
);



/* 
===================================================
- QUIZ TEMPLATES -
=================================================== 
*/

CREATE TABLE quizes (
	quiz_id int unsigned not null auto_increment,
	quiz_title varchar(512),
	is_active boolean default True,
	PRIMARY KEY (quiz_id)
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
	is_selected boolean default False,
	tag_id int unsigned,
	FOREIGN KEY (tag_id) REFERENCES Tags (id),
	text_field varchar(512) /*if 'other' is selected */
);

/* 
===================================================
- USER SPECIFIC -
=================================================== 
*/

CREATE TABLE user_quizes (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	user_id int unsigned,
	FOREIGN KEY (user_id) REFERENCES users (id),
	quiz_id int unsigned,
	FOREIGN KEY (quiz_id) REFERENCES quizes (quiz_id),
	time_begin timestamp
);

CREATE TABLE user_questions (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	user_quiz_id int unsigned,
	FOREIGN KEY (user_quiz_id) REFERENCES user_quizes (id),
	question_id int unsigned,
	FOREIGN KEY (question_id) REFERENCES questions (question_id)
		
);

CREATE TABLE user_choices (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	user_question_id int unsigned,
	FOREIGN KEY (user_question_id) REFERENCES user_questions (id),
	choice_id int unsigned,
	FOREIGN KEY (choice_id) REFERENCES choices (choice_id),
	is_selected boolean default False
);

/* 
===================================================
- SUGGESTED -
=================================================== 
*/

CREATE TABLE suggested_resources (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	user_id int unsigned,
	FOREIGN KEY (user_id) REFERENCES users (id),
	resource_id int unsigned,
	FOREIGN KEY (resource_id) REFERENCES resources (id)
);

CREATE TABLE suggested_organizations (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	user_id int unsigned,
	FOREIGN KEY (user_id) REFERENCES users (id),
	organization_id int unsigned,
	FOREIGN KEY (organization_id) REFERENCES organizations (id)
);

CREATE TABLE suggested_events (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	user_id int unsigned,
	FOREIGN KEY (user_id) REFERENCES users (id),
	event_id int unsigned,
	FOREIGN KEY (event_id) REFERENCES events (id)
);

CREATE TABLE suggested_congregations (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	user_id int unsigned,
	FOREIGN KEY (user_id) REFERENCES users (id),
	congregation_id int unsigned,
	FOREIGN KEY (congregation_id) REFERENCES congregations (id)
);




/* 
===================================================
- FAVORITES, VIEWS and SOCIAL MEDIA -
=================================================== 
*/


CREATE TABLE social_media_connections(
	id int unsigned auto_increment,
	name varchar(64),
	PRIMARY KEY (id),
	type varchar(32), 
	link varchar(64),
    user_id int unsigned not null,
    FOREIGN KEY (user_id) REFERENCES users (id)
    
);

/* for storing RESOURCES and congregations!!! */

CREATE TABLE resource_favorites(
	id int unsigned not null auto_increment,
    user_id int unsigned not null,
	resource_id int unsigned not null,
    time_favorited timestamp,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(resource_id) REFERENCES resources(id),
    PRIMARY KEY(id) 

);

CREATE TABLE cong_favorites(
	id int unsigned not null auto_increment,
    user_id int unsigned not null,
	cong_id int unsigned not null,
    time_favorited timestamp,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(cong_id) REFERENCES congregations(id),
    PRIMARY KEY(id) 
);

CREATE TABLE event_favorites(
	id int unsigned not null auto_increment,
    user_id int unsigned not null,
	event_id int unsigned not null,
    time_favorited timestamp,
    FOREIGN KEY(user_id) REFERENCES users(id),
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
	FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(resource_id) REFERENCES resources(id),
    PRIMARY KEY(id) 
    
);

CREATE TABLE user_viewed_congs(
	id int unsigned not null auto_increment,
    user_id int unsigned not null,
    cong_id int unsigned not null,
    time_begin timestamp,
	numViews int unsigned not null default 0,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(cong_id) REFERENCES congregations(id),
    PRIMARY KEY(id) 

);

CREATE TABLE user_viewed_events(
	id int unsigned not null auto_increment,
    user_id int unsigned not null,
    event_id int unsigned not null,
    time_begin timestamp,
	numViews int unsigned not null default 0,
    FOREIGN KEY(user_id) REFERENCES users(id),
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



