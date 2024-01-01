DROP TABLE IF EXISTS preferences_alimentaires;

CREATE TABLE IF NOT EXISTS preferences_alimentaires (
  ID SERIAL PRIMARY KEY,
  categorie_id INTEGER,
  titre TEXT,
  FOREIGN KEY (categorie_id) REFERENCES categories_preferences (ID)
);
