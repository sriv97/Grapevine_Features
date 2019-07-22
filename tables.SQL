create table users
(user_id int PRIMARY KEY,
displayName varchar(100),
title varchar(100),
company varchar(100),
location varchar(100),
pets TEXT []
);

create table user_relations
(user_id int,
rel_user_id int,
rel_id int,
PRIMARY KEY (user_id, rel_user_id));

create table relations
(rel_id int PRIMARY KEY,
relation	varchar(100)
);
