DROP table shopping_list;

CREATE TABLE shopping_list (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    item VARCHAR(100) NOT NULL,
    groupId INT REFERENCES groups(id) ON DELETE CASCADE
);

DROP table shopping_list;

CREATE TABLE shopping_list (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    item VARCHAR(100) NOT NULL,
    groupId INT REFERENCES groups(id) ON DELETE CASCADE
);

select * from  shopping_list



