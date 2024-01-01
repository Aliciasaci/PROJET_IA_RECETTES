DROP TABLE IF EXISTS preferences_users;

CREATE TABLE IF NOT EXISTS preferences_users (
  ID SERIAL PRIMARY KEY,
  user_id INTEGER,
  preference_id INTEGER,
  autre TEXT, 
  FOREIGN KEY (user_id) REFERENCES users (ID),
  FOREIGN KEY (preference_id) REFERENCES preferences_alimentaires (ID)
);