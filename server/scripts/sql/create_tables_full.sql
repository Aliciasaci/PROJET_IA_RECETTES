DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  ID SERIAL PRIMARY KEY,
  Nom VARCHAR(255),
  Prenom VARCHAR(255),
  Email VARCHAR(255),
  Password VARCHAR(255)
);

DROP TABLE IF EXISTS recettes;

CREATE TABLE IF NOT EXISTS recettes (
  ID SERIAL PRIMARY KEY,
  Titre VARCHAR(255),
  Ingredients TEXT,
  Instructions TEXT,
  TempsPreparation VARCHAR(255),
  Photo VARCHAR(255)
);

DROP TABLE IF EXISTS favorite_recettes;

CREATE TABLE IF NOT EXISTS favorite_recettes (
  ID SERIAL PRIMARY KEY,
  user_id INTEGER,
  recette_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users (ID),
  FOREIGN KEY (recette_id) REFERENCES recettes (ID)
);

DROP TABLE IF EXISTS categories_preferences;

CREATE TABLE IF NOT EXISTS categories_preferences (
  ID SERIAL PRIMARY KEY,
  titre VARCHAR(255)
);

DROP TABLE IF EXISTS preferences_alimentaires;

CREATE TABLE IF NOT EXISTS preferences_alimentaires (
  ID SERIAL PRIMARY KEY,
  categorie_id INTEGER,
  titre TEXT,
  FOREIGN KEY (categorie_id) REFERENCES categories_preferences (ID)
);

DROP TABLE IF EXISTS preferences_users;

CREATE TABLE IF NOT EXISTS preferences_users (
  ID SERIAL PRIMARY KEY,
  user_id INTEGER,
  preference_id INTEGER,
  autre TEXT, 
  FOREIGN KEY (user_id) REFERENCES users (ID),
  FOREIGN KEY (preference_id) REFERENCES preferences_alimentaires (ID)
);

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



