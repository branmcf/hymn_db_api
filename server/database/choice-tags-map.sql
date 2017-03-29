
SET FOREIGN_KEY_CHECKS=0;

delete from choices;
delete from questions;
delete from quizes;


DELETE FROM quizes;
DELETE FROM questions;
DELETE FROM CHOICES;

SET FOREIGN_KEY_CHECKS=1;

ALTER TABLE quizes AUTO_INCREMENT = 1;
ALTER TABLE questions AUTO_INCREMENT = 1;
ALTER TABLE choices AUTO_INCREMENT = 1;

INSERT INTO quizes(quiz_title) VALUES("Quiz Template");
INSERT INTO questions(question_text, quiz_id) VALUES ("Which types of song/hymn(s) has your congregation sung in the last 2 months?", 1);
INSERT INTO choices(question_id, choice_text, tags) VALUES
(1, "A hymn written prior to 1970", '["classic"]'),
(1, "Newly composed hymn (within the last 10 years)", '["modern"]'),
(1, "A song written by our own artist/leader", '["local"]'),
(1, "Praise and Worship Song (CCM)", '["ccm"]'),
(1, "Psalm Setting", '["psalm"]'),
(1, "Chant (Gregorian, Anglican, Pointed or Taize)", '["chant", "gregorian", "anglican", "pointed", "taize"]'),
(1, "Older hymn text set to a new contemporary tune (or re-tuned)", '["classic", "contemporary"]'),
(1, "Song from another country (or World Song)", '["foreign", "world", "international"]'),
(1, "Secular Song", '["secular"]');
 
INSERT INTO questions(question_text, quiz_id) VALUES ("Select instrumental leadership do you use in worship?", 1);
INSERT INTO choices(question_id, choice_text, tags) VALUES     
(2, "Acappella", '["acappella"]'),
(2, "Organ", '["Organ"]'),
(2, "Piano", '["Piano"]'),
(2, "Guitar (not full band)", '["Guitar"]'),
(2, "Band (guitar, bass, drums, etc...)", '["Band", "guitar", "bass", "drums"]'),
(2, "Orchestra/Wind Ensemble", '["Orchestra", "wind"]'),
(2, "Handbells", '["Handbells"]'),
(2, "Obligato Instruments (flute, clarinet, trumpet, etc...)", '["Obligato", "flute", "clarinet", "trumpet"]');
 
INSERT INTO questions(question_text, quiz_id) VALUES ("What vocal leadership do you use in worship?", 1);
INSERT INTO choices(question_id, choice_text, tags) VALUES  
(3, "Choir", '["choir"]'),
(3, "Cantor", '["Cantor"]'),
(3, "Song-Enlivener", '["Enlivener", "Song-Enlivener"]'),
(3, "Lead Singer from Band (Solo)", '["band", "lead", "solo"]'),
(3, "Lead Singer from Band with Other Vocalists", '["Vocalists", "lead", "band"]');
 
INSERT INTO questions(question_text, quiz_id) VALUES ("Which best describes the shape of your worship?", 1);
INSERT INTO choices(question_id, choice_text, tags) VALUES  
(4, "5-Fold Pattern (Gathering, Word, Response, Table, Sending) - Roman Catholic Mass and similar structures", '["5-Fold", "Gathering", "Roman Catholic", "catholic", "mass"]'),
(4, "4-Fold Pattern (Gathering, Word, Response, Sending) - Communion monthly or quarterly", '["4-Fold", "gathering", "communion"]'),
(4, "2-Fold Pattern (Praise & Teaching) - Most Praise and Worship services", '["2-Fold", "Praise and Teaching"]');
 
 
INSERT INTO questions(question_text, quiz_id) VALUES ("What does your pastor/priest wear when he/she preaches?", 1);
INSERT INTO choices(question_id, choice_text, tags) VALUES  
(5, "Vestments", '["Vestments"]'),
(5, "Robes, with or without stoles", '["Robes"]'),
(5, "Business Attire", '["Business Attire", "business"]'),
(5, "Casual", '["Casual"]');
 
/* */
INSERT INTO questions(question_text, quiz_id) VALUES ("What ethnicities/races make up at least 20% of your congregation?", 1);
INSERT INTO choices(question_id, choice_text, tags) VALUES  
(6, "Asian - Chinese Language/Heritage", '["Asian", "Chinese"]'),
(6, "Asian - Indian", '["Asian", "indian"]'),
(6, "Asian - Southeast Asian Non-Chinese", '["Asian", "southeast asian"]'),
(6, "Asian - Korean", '["Asian", "korean"]'),
(6, "Asian - Japanese", '["Asian", "japanese"]'),
(6, "Black - African-American", '["Black", "african-american"]'),
(6, "Black - Sub-Saharan African", '["black", "african"]'),
(6, "Hispanic/Latino/Spanish - Central/South American", '["Hispanic", "latino", "south american"]'),
(6, "Hispanic/Latino/Spanish - Caribbean", '["Hispanic", "latino", "caribbean"]'),
(6, "Native American/Indigenous Peoples", '["Native American"]'),
(6, "Native American/Pacific Islander", '["Native American", "Pacific Islander"]'),
(6, "North African/Middle Eastern", '["North African", "middle eastern"]'),
(6, "White", '["white", "european"]');
 
INSERT INTO questions(question_text, quiz_id) VALUES ("On average, how many people attend your weekly worship services?", 1);
INSERT INTO choices(question_id, choice_text, tags) VALUES  
(7, "Under 100", '["Under 100", "small"]'),
(7, "Between 100 and 250", '["small"]'),
(7, "Between 250 and 500", '["medium"]'),
(7, "Between 500 and 1000", '["medium", "large"]'),
(7, "Over 1000", '["over 1000", "large"]');
 