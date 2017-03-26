/*
INSERT INTO choices(tags) VALUES ('["1", "2", "3"]');
*/

/*
ALTER TABLE quizes AUTO_INCREMENT = 1;
ALTER TABLE questions AUTO_INCREMENT = 1;
ALTER TABLE choices AUTO_INCREMENT = 1;
*/




/* 
=================================
IGNORE ABOVE...
BELOW, ADD "answers" COLUMN TO USERS THAT
REPRESENTS THE CHOICE_ID'S FROM CHOICES TABLE
=================================
*/

ALTER TABLE users
ADD answers JSON DEFAULT NULL;