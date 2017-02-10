SET FOREIGN_KEY_CHECKS=0;

/*
DROP TABLE IF EXISTS event_table;
DROP TABLE IF EXISTS Event_Table;
*/

DROP TABLE IF EXISTS congregation_tags;
DROP TABLE IF EXISTS congregation_denominations;
DROP TABLE IF EXISTS congregation_song_types;
DROP TABLE IF EXISTS congregation_instrument_types;
DROP TABLE IF EXISTS congregation_worship_types;
DROP TABLE IF EXISTS congregation_types;
DROP TABLE IF EXISTS congregation_ethnicities;
DROP TABLE IF EXISTS congregation_congregation_categories;
DROP TABLE IF EXISTS congregation_favorites;
DROP TABLE IF EXISTS congregation_languages;

DROP TABLE IF EXISTS event_tags;
DROP TABLE IF EXISTS event_event_types;
DROP TABLE IF EXISTS event_favorites;

DROP TABLE IF EXISTS resource_resource_category;
DROP TABLE IF EXISTS resource_tags;
DROP TABLE IF EXISTS resource_authors;
DROP TABLE IF EXISTS resource_resource_types;
DROP TABLE IF EXISTS resource_denominations;
DROP TABLE IF EXISTS resource_instruments;
DROP TABLE IF EXISTS resource_topics;
DROP TABLE IF EXISTS resource_ensembles;
DROP TABLE IF EXISTS resource_ethnicities;
DROP TABLE IF EXISTS resource_accompaniment;
DROP TABLE IF EXISTS resource_languages;
DROP TABLE IF EXISTS resource_resource_categories;
DROP TABLE IF EXISTS resource_favorites;
DROP TABLE IF EXISTS resource_users;

DROP TABLE IF EXISTS organization_tags;
DROP TABLE IF EXISTS organization_song_types;
DROP TABLE IF EXISTS organization_instrument_types;
DROP TABLE IF EXISTS organization_worship_types;
DROP TABLE IF EXISTS organization_ethnicities;
DROP TABLE IF EXISTS organization_congregations;
DROP TABLE IF EXISTS organization_denominations;

DROP TABLE IF EXISTS user_ethnicities;
DROP TABLE IF EXISTS user_viewed_events;
DROP TABLE IF EXISTS user_viewed_congs;
DROP TABLE IF EXISTS user_viewed_resources;
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
DROP TABLE IF EXISTS resources;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS Ensembles;
DROP TABLE IF EXISTS Topics;
DROP TABLE IF EXISTS Languages;
DROP TABLE IF EXISTS Resource_Types;
DROP TABLE IF EXISTS Authors;

DROP TABLE IF EXISTS Congregation_Categories;
DROP TABLE IF EXISTS Resource_Categories;
DROP TABLE IF EXISTS Accompaniment;

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
- ATTRIBUTE TABLES - SET FOREIGN_KEY_CHECKS=1;
===================================================
*/

CREATE TABLE Congregation_Categories (
	id int unsigned not null auto_increment,
	name varchar(128),
  	other_text varchar(256),
	PRIMARY KEY (id)
);

CREATE TABLE Resource_Categories (
	id int unsigned not null auto_increment,
	name varchar(128),
    other_text varchar(256),
	PRIMARY KEY (id)
);

CREATE TABLE Accompaniment (
	id int unsigned not null auto_increment,
	name varchar(128),
    other_text varchar(256),
	PRIMARY KEY (id)
);


CREATE TABLE Tags (
	id int unsigned not null auto_increment,
	name varchar(128),
	other_text varchar(256),
	PRIMARY KEY (id)
	/* maybe link to other tables like congregation types? */
);

/*
CREATE TABLE Authors (
	id int unsigned auto_increment,
	name varchar(128),
	PRIMARY KEY (id),
	website varchar(128),
	email varchar(64)
);
*/

/*
CREATE TABLE Resource_Types (
	id int unsigned auto_increment,
	name varchar(128),
    other_text varchar(256),
	PRIMARY KEY (id)
);
*/


CREATE TABLE Languages (
	id int unsigned auto_increment,
	name varchar(128),
    other_text varchar(256),
	PRIMARY KEY (id)
);

CREATE TABLE Topics (
	id int unsigned auto_increment,
	name varchar(128),
    other_text varchar(256),
	PRIMARY KEY (id)
);

CREATE TABLE Ensembles (
	id int unsigned auto_increment,
	name varchar(128),
    other_text varchar(256),
	PRIMARY KEY (id)
);

/*
CREATE TABLE Parent_Org (
	id int unsigned auto_increment,
	name varchar(128),
    other_text varchar(256),
	PRIMARY KEY (id)
);
*/

CREATE TABLE Event_Types (
	id int unsigned auto_increment,
	name varchar(64),
    other_text varchar(256),
	PRIMARY KEY (id)
);

CREATE TABLE Denominations (
	id int unsigned auto_increment,
	name varchar(64),
    other_text varchar(256),
	PRIMARY KEY (id)
);

CREATE TABLE Song_Types (
	id int unsigned auto_increment,
	name varchar(64),
    other_text varchar(256),
	PRIMARY KEY (id)
);

CREATE TABLE Instrument_Types (
	id int unsigned auto_increment,
	name varchar(64),
    other_text varchar(256),
	PRIMARY KEY (id)
);

CREATE TABLE Worship_Types (
	id int unsigned auto_increment,
	name varchar(64),
    other_text varchar(256),
	PRIMARY KEY (id)
);

CREATE TABLE Cong_Types (
	id int unsigned auto_increment,
	name varchar(64),
    other_text varchar(256),
	PRIMARY KEY (id)
);

CREATE TABLE Ethnicities (
	id int unsigned auto_increment,
	name varchar(64),
    other_text varchar(256),
	PRIMARY KEY (id)
);

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
	is_admin boolean default false

);

CREATE TABLE resources (
	id int unsigned auto_increment,
	PRIMARY KEY (id),
	name varchar(128),
	INDEX(name(8)),	
	type varchar(64),
	INDEX(type(6)),
	website varchar(128),
	resource_date timestamp,
	description text(1024),
	parent varchar(128),
	author varchar(128),
	is_active boolean default true,
	high_level boolean default false,
	city varchar(64) default "Dallas",
	state varchar(64) default "Texas",
	country varchar(128) default "United States",
	hymn_soc_member boolean default false,
	is_free TINYINT(3) default 0,

	favorites int unsigned default 0,
	views int unsigned default 0,
	approved boolean default false,
    
    user varchar(64),
    user_id int unsigned
    
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
	event_date date,
	event_start_time time,
	cost varchar(64) default "$0.00",
	city varchar(64) default "Dallas",
	state varchar(64) default "Texas",
	country varchar(128) default "United States",
	hymn_soc_member boolean default false,
	is_active boolean default false,
	high_level boolean default false,

	event_end_date date,
	event_end_time time,
	views int unsigned default 0,
	favorites int unsigned default 0,
	expected_attendance varchar(64),
	amount_going int unsigned default 0,
	approved boolean default false,
    
    user_id int unsigned,
    user varchar(64)
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
	offers_free_events TINYINT(3) default 0,
	charge decimal(6) default 0.00,
	mission varchar(256),
	the_process varchar(256),
	hymn_soc_member boolean default false,
	is_active boolean default false,
    high_level boolean default false,

	promotions varchar(256),
	priest_attire varchar(64),
    shape varchar(128),
    clothing varchar(128),
    attendance varchar(64),
    membership_free TINYINT(3) default 0,
    approved boolean default false,
    
    user_id int unsigned,
    user varchar(64)

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
	
	priest_attire varchar(64),
	description_of_worship_to_guests text(512),
	is_free TINYINT(3) default 0,
	events_free TINYINT(3) default 0,
	the_process varchar(128),
	approved boolean default false,
    
    user_id int unsigned,
    user varchar(64)

);

CREATE TABLE user_ethnicities(
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	user_id int unsigned,
	FOREIGN KEY (user_id) REFERENCES users(id),
	ethnicity_id int unsigned,
	FOREIGN KEY (ethnicity_id) REFERENCES Ethnicities(id)

);

/*
===================================================
- INTERMEDIATE TABLES FOR CONGREGATIONS -
===================================================
*/

CREATE TABLE congregation_languages (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	congregation_id int unsigned,
	FOREIGN KEY (congregation_id) REFERENCES congregations (id),
	language_id int unsigned,
	FOREIGN KEY (language_id) REFERENCES Languages (id)

);

CREATE TABLE congregation_congregation_categories (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	congregation_id int unsigned,
	FOREIGN KEY (congregation_id) REFERENCES congregations (id),
	congregation_category_id int unsigned,
	FOREIGN KEY (congregation_category_id) REFERENCES Congregation_Categories (id)
);

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

CREATE TABLE resource_users (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	resource_id int unsigned,
	FOREIGN KEY (resource_id) REFERENCES resources (id),
	user_id int unsigned,
	FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE resource_languages(
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	resource_id int unsigned,
	FOREIGN KEY (resource_id) REFERENCES resources (id),
	language_id int unsigned,
	FOREIGN KEY (language_id) REFERENCES Languages (id)
);

CREATE TABLE resource_accompaniment (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	resource_id int unsigned,
	FOREIGN KEY (resource_id) REFERENCES resources (id),
	accompaniment_id int unsigned,
	FOREIGN KEY (accompaniment_id) REFERENCES Accompaniment (id)
);

CREATE TABLE resource_tags (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	resource_id int unsigned,
	FOREIGN KEY (resource_id) REFERENCES resources (id),
	tag_id int unsigned,
	FOREIGN KEY (tag_id) REFERENCES Tags (id)
);

CREATE TABLE resource_resource_categories (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	resource_id int unsigned,
	FOREIGN KEY (resource_id) REFERENCES resources (id),
	resource_category_id int unsigned,
	FOREIGN KEY (resource_category_id) REFERENCES Resource_Categories (id)
);
/*
CREATE TABLE resource_authors (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	resource_id int unsigned,
	FOREIGN KEY (resource_id) REFERENCES resources (id),
	author_id int unsigned,
	FOREIGN KEY (author_id) REFERENCES Authors (id)
);
*/

/*
CREATE TABLE resource_resource_types (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	resource_id int unsigned,
	FOREIGN KEY (resource_id) REFERENCES resources (id),
	resource_type_id int unsigned,
	FOREIGN KEY (resource_type_id) REFERENCES Resource_Types (id)
);
*/

CREATE TABLE resource_denominations (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	resource_id int unsigned,
	FOREIGN KEY (resource_id) REFERENCES resources (id),
	denomination_id int unsigned,
	FOREIGN KEY (denomination_id) REFERENCES Denominations (id)
);

CREATE TABLE resource_instruments (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	resource_id int unsigned,
	FOREIGN KEY (resource_id) REFERENCES resources (id),
	instrument_type_id int unsigned,
	FOREIGN KEY (instrument_type_id) REFERENCES Instrument_Types (id)
);

CREATE TABLE resource_topics (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	resource_id int unsigned,
	FOREIGN KEY (resource_id) REFERENCES resources (id),
	topic_id int unsigned,
	FOREIGN KEY (topic_id) REFERENCES Topics (id)
);

CREATE TABLE resource_ensembles (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	resource_id int unsigned,
	FOREIGN KEY (resource_id) REFERENCES resources (id),
	ensemble_id int unsigned,
	FOREIGN KEY (ensemble_id) REFERENCES Ensembles (id)
);

CREATE TABLE resource_ethnicities (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	resource_id int unsigned,
	FOREIGN KEY (resource_id) REFERENCES resources (id),
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
	is_active boolean default true,
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
	is_selected boolean default false,
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
	is_selected boolean default false
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

CREATE TABLE congregation_favorites(
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

DROP TABLE IF EXISTS person_ethnicities;
DROP TABLE IF EXISTS person_ensembles;
DROP TABLE IF EXISTS person_topics;
DROP TABLE IF EXISTS persons;
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
	social_url varchar(128),
	emphasis varchar(128),
	hymn_soc_member boolean default false,

	approved boolean default false,
	is_active boolean default false,
	high_level boolean default false,
	user_id int unsigned,
	user varchar(64)

);


CREATE TABLE person_topics (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	person_id int unsigned,
	FOREIGN KEY (person_id) REFERENCES persons (id),
	topic_id int unsigned,
	FOREIGN KEY (topic_id) REFERENCES Topics (id)
);


CREATE TABLE person_ensembles(
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	person_id int unsigned,
	FOREIGN KEY (person_id) REFERENCES persons (id),
	ensemble_id int unsigned,
	FOREIGN KEY (ensemble_id) REFERENCES Ensembles (id)
);


CREATE TABLE person_ethnicities (
	id int unsigned not null auto_increment,
	PRIMARY KEY (id),
	person_id int unsigned,
	FOREIGN KEY (person_id) REFERENCES persons (id),
	ethnicity_id int unsigned,
	FOREIGN KEY (ethnicity_id) REFERENCES Ethnicities (id)
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
