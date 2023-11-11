
DROP TABLE IF EXISTS recettes;

CREATE TABLE IF NOT EXISTS recettes (
  ID SERIAL PRIMARY KEY,
  Titre VARCHAR(255),
  Ingredients TEXT,
  Instructions TEXT,
  TempsPreparation VARCHAR(255),
  Photo VARCHAR(255)
);
