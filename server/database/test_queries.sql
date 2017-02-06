/* Create quiz with questions */
ALTER TABLE users auto_increment = 1;

ALTER TABLE resources auto_increment = 1;
	ALTER TABLE resource_ethnicities auto_increment = 1;
	ALTER TABLE resource_tags auto_increment = 1;
	ALTER TABLE resource_ensembles auto_increment = 1;
	ALTER TABLE resource_denominations auto_increment = 1;
	ALTER TABLE resource_languages auto_increment = 1;
    ALTER TABLE resource_resource_categories auto_increment = 1;
	ALTER TABLE resource_topics auto_increment = 1;

ALTER TABLE Languages auto_increment = 1;
ALTER TABLE Song_Types auto_increment = 1;

ALTER TABLE organizations auto_increment = 1;
	ALTER TABLE organization_tags auto_increment = 1;
	ALTER TABLE organization_song_types auto_increment = 1;
	ALTER TABLE organization_instrument_types auto_increment = 1;
	ALTER TABLE organization_congregations auto_increment = 1;

ALTER TABLE congregations auto_increment = 1;
	ALTER TABLE Congregation_Categories auto_increment = 1;
	ALTER TABLE congregation_tags auto_increment = 1;
	ALTER TABLE congregation_instrument_types auto_increment = 1;
	ALTER TABLE congregation_denominations auto_increment = 1;
	ALTER TABLE congregation_types auto_increment = 1;
	ALTER TABLE congregation_ethnicities auto_increment = 1;
	ALTER TABLE Cong_Types auto_increment = 1;
	ALTER TABLE congregation_congregation_categories auto_increment = 1;

ALTER TABLE events auto_increment = 1;
	ALTER TABLE event_tags auto_increment = 1;
	ALTER TABLE event_event_types auto_increment = 1;
	ALTER TABLE Event_Types auto_increment = 1;

ALTER TABLE quizes auto_increment = 1;
ALTER TABLE questions auto_increment = 1;
ALTER TABLE choices auto_increment = 1;
ALTER TABLE Tags auto_increment = 1;

ALTER TABLE Denominations auto_increment = 1;
ALTER TABLE Instrument_Types auto_increment = 1;
ALTER TABLE Topics auto_increment = 1;
ALTER TABLE Ensembles auto_increment = 1;
ALTER TABLE Ethnicities auto_increment = 1;
ALTER TABLE Resource_Categories auto_increment = 1;
ALTER TABLE Accompaniment auto_increment = 1;

ALTER TABLE persons auto_increment = 1;
	ALTER TABLE person_topics auto_increment = 1;
	ALTER TABLE person_ensembles auto_increment = 1;
	ALTER TABLE person_ethnicities auto_increment = 1;


INSERT INTO Languages(name) VALUES ('English'), ('Spanish'), ('French');

/* TAGS */
INSERT INTO Tags(name) VALUES ('Other'),('Catholic'),('Protestant'),('Baptist'),('Lutheran'),('Orthodox'),('Anglican'),('Conservative'),('Liberal'),('Moderate');

/* END TAGS */

/* Resource Data */
INSERT INTO Denominations(name) VALUES ("Catholic"), ("Lutheran"), ("Baptist"), ("Orthodox"), ("Non-Denominational"), ("Other");
INSERT INTO Instrument_Types(name) VALUES ("None"), ("Organ"), ("Modern Band"), ("Other");
INSERT INTO Ensembles(name) VALUES("Lead_Singer_from_Band_with_Other_Vocalists"),
("Choir"),("Cantor"),("Song_Enlivener"),("Solo"),("Other");
INSERT INTO Ethnicities(name) VALUES ("White"), ("Black"), ("Middle_Eastern"), ("Hispanic"),("Asian"),("Indian"),("Native American"),
("Hispanic_Latin_American_Caribbean"),("Native_American_Indigenous_Peoples"),("Other"),("African");

INSERT INTO Resource_Categories(name)
VALUES ("A_hymn_written_prior_to_1970"),
("Newly_composed_hymn_within_the_last_10_years"),
("Song_by_local_church_musicians"),
("Praise_and_Worship_Song"),
("Psalm_Setting"),
("Chant"),
("Older_hymn_text_set_to_a_new_contemporary_tune"),
("Song_from_another_country"),
("Secular_Song"),
("Other");
INSERT INTO Topics (name)
VALUES ("Psalm_Setting"),
("Lectionary_Based"),
("Contemporary_Song_Band"),
("Traditional_Hymnody"),
("Musician_Pastor_Relationship_Song_Band"),
("Cantoring"),
("Song_Enlivening"),
("Keyboards"),
("Worship_Planning"),
("Social_Justice"),
("Other");
INSERT INTO Accompaniment(name) 
VALUES 
("Handbells"),
("Obligato"),
("Acapella"),
("Organ"),
("Piano"),
("Guitar_no_band"),
("Guitar_with_band"),
("Orchestra_Wind_Ensemble"),
("Other");



/* resources */
INSERT INTO resources(name, website, hymn_soc_member, is_free, description, parent, author, type, approved)
VALUES ("test_title_1","https://google.com",0,1,"test_description_1","Parent 1", "John Steinbeck", "Book", true), ("test_title_2","https://bing.com",0,1,"test_description_2","Parent 2", "John Steinbeck", "Blog", false);


INSERT INTO resource_tags(resource_id, tag_id) VALUES(1,1),(1,3),(2,2);
INSERT INTO resource_denominations(resource_id, denomination_id) VALUES(1,1),(2,1),(2,2);
INSERT INTO resource_instruments(resource_id, instrument_type_id) VALUES(1,1),(2,1),(2,2),(2,3);
INSERT INTO resource_topics(resource_id, topic_id) VALUES(1,1),(2,2);
INSERT INTO resource_ensembles(resource_id, ensemble_id) VALUES(1,1),(2,2);
INSERT INTO resource_ethnicities(resource_id, ethnicity_id) VALUES(1,1),(2,2);
INSERT INTO resource_languages(resource_id, language_id) VALUES(1,2), (2,1), (2,3);


INSERT INTO resource_accompaniment(resource_id, accompaniment_id) VALUES(1,1),(1,2),(2,1),(2,3);





/*
INSERT INTO users(email, password, first_name, last_name, high_level) VALUES ('testemail1@yahoo.com', 'asdpassword1asd', 'Jim', 'Tom Jenkins');
INSERT INTO users(email, password, first_name, last_name) VALUES ('JUST@yahoo.com', 'asdpassword2asd', 'Vasili', 'Zaitev');
INSERT INTO users(email, password, first_name, last_name) VALUES ('anotheremail@yahoo.com', 'asdpassword3asd', 'Bob', 'Lewandowski');
INSERT INTO users(email, password, first_name, last_name) VALUES ('foobar@yahoo.com', 'asdpassword4asd', 'Gertrude', 'Hammerschmidt');
INSERT INTO users(email, password, first_name, last_name) VALUES ('daksdaiuwd@yahoo.com', 'asdpassword5asd', 'Dak', 'Prescott');
*/

/* User eth */
/*
INSERT INTO user_ethnicities(user_id, ethnicity_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(3, 2),
(4, 3),
(5, 4);
*/


INSERT INTO quizes(quiz_title)
VALUES
('Primary Quiz');


INSERT INTO questions(question_text, question_weight, quiz_id)
VALUES
('What is your denomination?', 3, 1);


INSERT INTO choices(choice_text, question_id, tag_id)
VALUES
('Protestant', 1, 3),
('Catholic', 1, 2),
('Orthodox', 1, 6),
('Other', 1, 1);

INSERT INTO questions(question_text, question_weight, quiz_id)
VALUES
('What is your Race?', 1, 1);

INSERT INTO choices(choice_text, question_id)
VALUES
('White', 2),
('Black', 2),
('Hispanic', 2),
('Eastern Asian', 2),
('Indian', 2),
('Other', 2);

INSERT INTO questions(question_text, question_weight, quiz_id)
VALUES
('What line do you fall on the political spectrum?', 1, 1);

INSERT INTO choices(choice_text, question_id)
VALUES
('Conservative', 3),
('Liberal', 3),
('Moderate', 3);

/* organizations */

INSERT INTO organizations (
name,
website,
mission,
priest_attire
)
VALUES (
"Catholic_Church",
"https://catholicchurch.org",
"Catholicism",
"Robes"
),
("Church_of_England",
"https://churchofengland.org",
"Church of England",
"Business Attire"
);



/* events */

INSERT INTO events (
name,
website,
frequency,
theme,
description,
cost,
hymn_soc_member,
city,
state,
country,
is_active

) VALUES (
"EVENT NAME 1",
"https://asdawdawde.com",
"Annual",
"Music Festival",
"Woah man take it easy...",
"$0.00",
0,
"Little Rock",
"Arkansas",
"United States",
1
),
(
"daeaweadawde",
"https://eyo.mx",
"Semi-Annual",
"Music Festival",
"Hey what's up",
"$50.00",
0,
"Guadalajara",
"Guadalupe",
"Mexico",
1
);

/* Congs */
INSERT INTO congregations(name, website, hymn_soc_member) VALUES
("cong number 1", "https://google.com", True),
("cong number 2", "https://yahoo.com", True);

INSERT INTO Cong_Types(name) VALUES ("Cong Type 1"), ("Cong Type 2"), ("Cong Type 3"), ("Cong Type 2");
INSERT INTO Instrument_Types(name) VALUES ("Acapella"), ("Organ"), ("Piano");
INSERT INTO Congregation_Categories(name) VALUES ("Secular Song");

INSERT INTO congregation_congregation_categories(congregation_id, congregation_category_id) VALUES (1,1), (2,1);
INSERT INTO congregation_denominations(congregation_id, denomination_id) VALUES (1,1), (1,2), (2,1);
INSERT INTO congregation_types(congregation_id, congregation_type_id) VALUES (1,1), (1,2), (2,1);
INSERT INTO congregation_instrument_types(congregation_id, instrument_type_id) VALUES (1,1), (1,2), (2,1);
INSERT INTO congregation_ethnicities(congregation_id, ethnicity_id) VALUES (1,1), (2,1);
INSERT INTO congregation_tags(congregation_id, tag_id) VALUES (1,1), (1,2), (2,1);

/* Orgs */
INSERT INTO Song_Types(name) VALUES("Song Type 1"), ("Song Type 2");
INSERT INTO organizations(name, website)
VALUES
("Organization 1", "https://yahoo.com"),
("Organization 2", "https://yahooooooo.com");
INSERT INTO organization_tags(organization_id, tag_id) VALUES (1,1), (1,2), (2,3);
INSERT INTO organization_song_types(organization_id, song_type_id) VALUES (1,1), (1,2), (2,2);
INSERT INTO organization_instrument_types(organization_id, instrument_type_id) VALUES (1,1), (1,2), (2,1);
INSERT INTO organization_congregations(organization_id, congregation_id) VALUES (1,1), (1,2), (2,1);


/* Event middle tables */
INSERT INTO Event_Types(name) VALUES ("Event Type 1"), ("Event Type 2"), ("Event Type 3");

INSERT INTO event_tags(event_id, tag_id) VALUES (1,1), (1,2), (2,1);
INSERT INTO event_event_types(event_id, event_type_id) VALUES (1,1), (1,2), (1,3), (2,1), (2,2);

INSERT INTO persons(email, first_name, last_name) VALUES ("ActionDan@gmail.com", "Action", "Dan"), ("hunter2@yahoo.com", "ya", "hoo");
INSERT INTO person_topics(person_id, topic_id) VALUES(1,1),(1,2),(2,1),(2,2);
INSERT INTO person_ensembles(person_id, ensemble_id) VALUES(1,1),(1,2),(2,1),(2,2);
INSERT INTO person_ethnicities(person_id, ethnicity_id) VALUES(1,1),(1,2),(1,3),(2,1),(2,2);
