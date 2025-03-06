CREATE TABLE users(
    id 	BIGSERIAL PRIMARY KEY NOT NULL,
	name VARCHAR(200) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL   
);

INSERT INTO users(name, email, password) VALUES ("Yashvi", "yashvipatel@gmail.com", "password");
