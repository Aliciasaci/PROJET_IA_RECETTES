DROP TABLE IF EXISTS favorite_recettes;

CREATE TABLE IF NOT EXISTS favorite_recettes (
  ID SERIAL PRIMARY KEY,
  user_id INTEGER,
  recette_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users (ID),
  FOREIGN KEY (recette_id) REFERENCES recettes (ID)
);
