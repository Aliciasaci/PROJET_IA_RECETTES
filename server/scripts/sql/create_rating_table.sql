DROP TABLE IF EXISTS rating;

CREATE TABLE IF NOT EXISTS rating (
  ID SERIAL PRIMARY KEY,
  user_id INTEGER,
  recette_id INTEGER,
  note FLOAT,
  FOREIGN KEY (user_id) REFERENCES users (ID),
  FOREIGN KEY (recette_id) REFERENCES recettes (ID)
);
