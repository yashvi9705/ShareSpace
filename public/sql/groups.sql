DROP table groups;
DROP table group_members

CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    inviteLink VARCHAR(255) UNIQUE NOT NULL,
    created_by INT REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE group_members (
    id SERIAL PRIMARY KEY,
    group_id INT REFERENCES groups(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(group_id, user_id)
);

select * from groups
delete from group_members where id =11
select * from group_members