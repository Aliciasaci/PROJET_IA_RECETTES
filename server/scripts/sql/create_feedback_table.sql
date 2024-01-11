DROP TABLE IF EXISTS feedback;

CREATE TABLE IF NOT EXISTS feedback (
  ID SERIAL PRIMARY KEY,
  user_id INTEGER,
  recette_id INTEGER,
  commentaire TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (ID),
  FOREIGN KEY (recette_id) REFERENCES recettes (ID)
);
