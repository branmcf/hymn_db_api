/*
INSERT INTO() VALUES();
*/
DELETE FROM resources;

INSERT INTO resources(name, author, approved, categories) VALUES
("name 1", "author 1", 1, '["category 1a", "category 1b"]'),
("name 2", "author 2", 1, '["category 2a", "category 2b"]'),
("name 3", "author 3", 0, '["category 3a", "category 3b"]');