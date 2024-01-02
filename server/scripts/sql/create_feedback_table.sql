DROP TABLE IF EXISTS feedback;

CREATE TABLE IF NOT EXISTS feedback (
  ID SERIAL PRIMARY KEY,
  user_id INTEGER,
  recette_id INTEGER,
  note INTEGER,
  commentaire TEXT,
  FOREIGN KEY (user_id) REFERENCES users (ID),
  FOREIGN KEY (recette_id) REFERENCES recettes (ID)
);
