/*
INSERT INTO() VALUES();
*/
alter table resources auto_increment = 1;

INSERT INTO resources(name, author, approved, categories, type) VALUES
("name 1", "author 1", 1, '["A hymn written prior to 1970", "category 1b"]', "book"),
("name 2", "author 2", 1, '["category 2a", "category 2b"]', "book"),
("name 3", "author 3", 0, '["category 3a", "category 3b"]', "blog"),
("name 3", "author 3", 1, '["category 4a", "category 4b"]', "blog");

alter table events auto_increment = 1;

INSERT INTO events(name, approved, tags) VALUES
("name 1", 1, '["category 1a", "category 1b"]'),
("name 2", 1, '["category 2a", "category 2b"]'),
("name 3", 0, '["category 3a", "category 3b"]'),
("name 3", 1, '["category 4a", "category 4b"]');

alter table organizations auto_increment = 1;

INSERT INTO organizations(name, approved, tags) VALUES
("name 1",  1, '["category 1a", "category 1b"]'),
("name 2",  1, '["category 2a", "category 2b"]'),
("name 3",  0, '["category 3a", "category 3b"]'),
("name 3",  1, '["category 4a", "category 4b"]');

alter table congregations auto_increment = 1;

INSERT INTO congregations(name, approved, tags) VALUES
("name 1",  1, '["category 1a", "category 1b"]'),
("name 2",  1, '["category 2a", "category 2b"]'),
("name 3",  0, '["category 3a", "category 3b"]'),
("name 3", 1, '["category 4a", "category 4b"]');

alter table persons auto_increment = 1;

INSERT INTO persons(first_name, approved, tags) VALUES
("name 1",  1, '["category 1a", "category 1b"]'),
("name 2",  1, '["category 2a", "category 2b"]'),
("name 3",  0, '["category 3a", "category 3b"]'),
("name 3",  1, '["category 4a", "category 4b"]');