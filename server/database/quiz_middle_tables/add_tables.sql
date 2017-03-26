/* Use this file to update middle tables */
SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS user_quizes;
DROP TABLE IF EXISTS user_quiz_questions;
DROP TABLE IF EXISTS user_quiz_choices;
DROP TABLE IF EXISTS user_question_answers;

DROP TABLE IF EXISTS user_quiz_answers;

SET FOREIGN_KEY_CHECKS=1;

/*
CREATE TABLE user_quizes(
	id int unsigned not null auto_increment,
    PRIMARY KEY(id),
    user_id int unsigned,
    FOREIGN KEY (user_id) REFERENCES users (id),
    quiz_id int unsigned,
    FOREIGN KEY (quiz_id) REFERENCES quizes (quiz_id)
) ENGINE=InnoDB;


CREATE TABLE user_quiz_answers(
	id int unsigned not null auto_increment,
    PRIMARY KEY(id),
	user_quiz_id int unsigned not null,
    FOREIGN KEY (user_quiz_id) REFERENCES user_quizes (id),
    choice_id int unsigned not null,
    FOREIGN KEY (choice_id) REFERENCES choices (choice_id),
    user_id int unsigned not null,
    FOREIGN KEY (user_id) REFERENCES users (id)

) ENGINE=InnoDB;

*/