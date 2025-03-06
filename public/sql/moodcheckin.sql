CREATE TABLE mood_entries (
  id SERIAL PRIMARY KEY,
  group_id INT REFERENCES groups(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  mood VARCHAR(10) NOT NULL,
  comment TEXT
);
