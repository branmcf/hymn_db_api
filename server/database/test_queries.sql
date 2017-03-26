/*
INSERT INTO() VALUES();
*/

SET FOREIGN_KEY_CHECKS=0;

DELETE FROM quizes;
DELETE FROM questions;
DELETE FROM CHOICES;

SET FOREIGN_KEY_CHECKS=1;

ALTER TABLE quizes AUTO_INCREMENT = 1;
ALTER TABLE questions AUTO_INCREMENT = 1;
ALTER TABLE choices AUTO_INCREMENT = 1;

INSERT INTO quizes(quiz_title) VALUES("Quiz Template 1");

INSERT INTO questions(quiz_id, question_text, question_weight) VALUES
(1, "Question Template 1", 1),
(1, "Question Template 2", 1),
(1, "Question Template 3", 1);

INSERT INTO choices(question_id, choice_text, tags) VALUES
(1, "Choice Template 1", '["protestant", "baptist", "rural"]'),
(1, "Choice Template 2", '["catholic", "urban"]'),
(1, "Choice Template 3", '["anglican", "urban"]'),

(2, "Choice Template 1", '["protestant", "baptist", "rural"]'), /* 4 */
(2, "Choice Template 2", '["catholic", "urban"]'),
(2, "Choice Template 3", '["anglican", "urban"]'),

(3, "Choice Template 1", '["protestant", "baptist", "rural"]'), /* 7 */
(3, "Choice Template 2", '["catholic", "urban"]'),
(3, "Choice Template 3", '["anglican", "urban"]');

/* Add/ update user answers */
UPDATE users SET answers = '[1, 4, 7]' WHERE id = 1;
UPDATE users SET answers = '[2, 5, 8]' WHERE id = 2;

