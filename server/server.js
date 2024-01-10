require("dotenv").config();
const express = require("express");
const OpenAI = require("openai");
const app = express();
const { Pool } = require("pg");
const { dbConfig } = require("./config/database.js");
const pool = new Pool(dbConfig);
const port = 5000;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const jwt = require("jsonwebtoken");

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());

async function fetchRecettes() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT titre FROM recettes");
    let data = result.rows;
    client.release();
    return data;
  } catch (error) {
    console.error("Error executing query", error);
  }
}

app.post("/fetchTitles", async (req, res) => {
  const searchPrompt = req.body.searchPrompt;
  try {
    const recettes = await fetchRecettes();

    const messages = [];
    messages.push({
      role: "system",
      content: `En te basant sur ces données ${JSON.stringify(
        recettes
      )} et la demande que l'utilisateur te fait. Renvoie SEULEMENT une array de string (je ne veux pas de texte en plus) avec les titres des recettes qui correspondent le mieux à la demande au format ["Titre1", "Titre2", ...etc]. Pas un objet JSON la demande peut être par temps de préparation. par catégorie de recette et par ingrédients.`,
    });

    //demande utiliasteur
    messages.push({ role: "user", content: searchPrompt });

    const completions = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      format: "json",
    });

    const assistantResponse = completions.choices[0].message.content;
    console.log(assistantResponse);
    res.json({ assistantResponse });
  } catch (error) {
    console.error("Error processing request", error);
    res.status(500).send("Internal Server Error");
  }
});

async function fetchRecettesByTitle(recettes) {
  try {
    let recettesArray = [];
    console.log("recettes", recettes);
    if (typeof recettes == "object") {
      recettesArray = Object.values(recettes);
    } else {
      recettesArray = JSON.parse(recettes);
    }
    const client = await pool.connect();
    const promises = recettesArray.map((recette) => {
      return client.query("SELECT * FROM recettes WHERE titre = $1", [recette]);
    });

    const results = await Promise.all(promises);
    const data = results.map((result) => result.rows);
    client.release();
    return data;
  } catch (error) {
    console.error("Error executing query", error);
  }
}

app.post("/fetchRecettesByTitle", async (req, res) => {
  const recettesTitle = req.body.recettesTitles;
  try {
    const recettesData = await fetchRecettesByTitle(recettesTitle);
    res.json({ recettesData });
  } catch (error) {
    console.error("Error processing request", error);
    res.status(500).send("Internal Server Error");
  }
});

async function fetchRecetteById(recetteId) {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM recettes WHERE id = $1", [
      recetteId,
    ]);
    const data = result.rows[0];
    client.release();
    return data;
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
}

app.get("/fetchRecetteById/:id/:userId", async (req, res) => {
  const recetteId = req.params.id;
  const userId = req.params.userId;
  try {
    const recetteData = await fetchRecetteById(recetteId);
    const favorites = await fetchFavorites(userId);
    if (recetteData) {
      res.json({ recetteData, favorites });
    } else {
      res.status(404).json({ message: "Recette non trouvée" });
    }
  } catch (error) {
    console.error("Error processing request", error);
    res.status(500).send("Internal Server Error");
  }
});

async function fetchSimilarRecipes(recetteTitle) {
  const recettes = await fetchRecettes();
  try {
    const completions = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `En te basant sur ces recettes ${JSON.stringify(
            recettes
          )}. recommandes toutes celles qui ressemblent à la recette suivante : ${JSON.stringify(
            recetteTitle
          )}. renvoi un objet json dont la clè du json est le terme 'recettes'. L'objet contient les titres des recettes. ne renvoi aucun autre texte, et supprime l'echappement des caractères.`,
        },
      ],
      format: "json",
    });

    result = completions.choices[0].message.content;
    return result;
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
}

app.get("/fetchSimilarRecipes", async (req, res) => {
  const titre = req.query.titre;
  try {
    const similarRecipes = await fetchSimilarRecipes(titre);
    console.log(similarRecipes);
    res.json({ similarRecipes });
  } catch (error) {
    console.error("Error processing request", error);
    res.status(500).send("Internal Server Error");
  }
});

//* generate random recipes
async function fetchRandomRecipes() {
  const recettes = await fetchRecettes();
  try {
    const completions = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `En te basant sur ces recettes ${JSON.stringify(
            recettes
          )}. proposes 5 recette aléatoires. renvoi un objet json avec uniquement les titres des recettes (je ne veux pas de texte en plus) dont la clè du json est le terme 'recettes'`,
        },
      ],
    });

    result = completions.choices[0].message.content;
    return result;
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
}

app.get("/fetchRandomRecipes/:userId", async (req, res) => {
  try {
    const randomRecipes = await fetchRandomRecipes();
    const { userId } = req.params;
    const favorites = await fetchFavorites(userId);
    res.json({ randomRecipes, favorites });
  } catch (error) {
    console.error("Error processing request", error);
    res.status(500).send("Internal Server Error");
  }
});

//* Générer liste de courses
async function generateGroceriesList(ingredients) {
  try {
    const completions = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Propose une liste d'ingrédient à acheter en te basant sur ces besoin :   ${JSON.stringify(
            ingredients
          )}. renvoi un objet json dont la clè du json est le terme 'ingredients'.`,
        },
      ],
    });

    result = completions.choices[0].message.content;
    return result;
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
}

app.post("/groceries", async (req, res) => {
  try {
    const ingredients = req.body.ingredients;
    console.log(ingredients);
    const groceries = await generateGroceriesList(ingredients);

    res.json({ groceries });
  } catch (error) {
    console.error("Error processing request", error);
    res.status(500).send("Internal Server Error");
  }
});

async function checkIfEmailAlreadyExists(email) {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const data = result.rows[0];
    client.release();
    return data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

async function signUp(user) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO users (nom, prenom, email, password) VALUES ($1, $2, $3, $4)",
      [user.nom, user.prenom, user.email, user.password]
    );
    const data = result.rows[0];
    client.release();
    return data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

app.post("/signUp", async (req, res) => {
  const { nom, prenom, email, password } = req.body;
  if (!nom || !prenom || !email || !password)
    return res.status(400).json({ message: "Champ(s) manquant(s)" });
  const duplicateEmail = await checkIfEmailAlreadyExists(email);
  if (duplicateEmail)
    return res.status(409).json({ message: "Email déjà utilisé" });
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      nom,
      prenom,
      email,
      password: hashedPassword,
    };
    await signUp(newUser);
    res.status(201).json({ message: "Utilisateur créé" });
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
});

async function signIn(email, password) {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const data = result.rows[0];

    if (!data) {
      client.release();
      throw new Error("Email non trouvé");
    }
    const passwordMatch = await bcrypt.compare(password, data.password);

    if (!passwordMatch) {
      client.release();
      throw new Error("Mot de passe incorrect");
    }
    client.release();
    return data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

app.post("/signIn", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email ou mot de passe incorrect" });
  try {
    const user = await signIn(email, password);

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 3600000 });
    res.json({
      accessToken,
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
    });
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
});

//* Générer accompagnement
async function generateAccompagnement(recette) {
  try {
    const completions = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Proposes des accompagnements à la recette suivante : ${JSON.stringify(
            recette
          )}. Les accompagnements doivent être des vins ou des frommages et un dessert sucré ou salé. renvoi un objet json dont la clè du json est le terme 'accompagnements'.`,
        },
      ],
    });

    result = completions.choices[0].message.content;
    return result;
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
}

app.post("/recettes/:id/accompagnements/", async (req, res) => {
  try {
    const recetteId = req.params.id;
    const recette = await fetchRecetteById(recetteId);
    const accompagnements = await generateAccompagnement(recette);

    res.json({ accompagnements });
  } catch (error) {
    console.error("Error processing request", error);
    res.status(500).send("Internal Server Error");
  }
});

async function addToFavorites(userId, recetteId) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO favorite_recettes (user_id, recette_id) VALUES ($1, $2) RETURNING *",
      [userId, recetteId]
    );
    const data = result.rows[0];
    client.release();
    return data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

app.post("/recettes/:id/favorites", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const result = await addToFavorites(userId, id);
    res.json({ result });
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
});

async function fetchFavorites(userId) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM favorite_recettes WHERE user_id = $1",
      [userId]
    );
    const data = result.rows;
    client.release();
    return data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

async function deleteFromFavorites(userId, recetteId) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "DELETE FROM favorite_recettes WHERE user_id = $1 AND recette_id = $2",
      [userId, recetteId]
    );
    const data = result.rows[0];
    client.release();
    return data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

app.delete("/delete/recettes/:id/favorites", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const result = await deleteFromFavorites(userId, id);
    res.json({ result });
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
});

async function chatBot(messages) {
  try {
    const completions = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Tu répondras, en 300 caractères maximum et avec l'expertise d'un chef étoilé au guide michelin ayant une 15aines d’années d’expérience dans le métier avec plusieurs concours culinaires gagnés à l’internationnal. Ton nom est Jean Bonboeur.",
        },
        {
          role: "user",
          content: JSON.stringify(messages),
        },
      ],
    });

    const response = completions.choices[0].message.content;
    return response;
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
}

app.post("/chatbot", async (req, res) => {
  try {
    const messages = req.body.input;
    const response = await chatBot(messages);
    res.json({ response });
  } catch (error) {
    console.error("Error processing request", error);
    res.status(500).send("Internal Server Error");
  }
});

async function addRating(userId, recetteId, rating) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO rating (user_id, recette_id, note) VALUES ($1, $2, $3) RETURNING *",
      [userId, recetteId, rating]
    );
    const data = result.rows[0];
    client.release();
    return data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

app.post("/recettes/:id/rating", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, newRating } = req.body;
    const result = await addRating(userId, id, newRating);
    res.json({ result });
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
});

async function getRating(recetteId) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT recette_id, AVG(note) as avg_note FROM rating WHERE recette_id = $1 GROUP BY recette_id",
      [recetteId]
    );
    const data = result.rows;
    client.release();
    return data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

app.get("/recettes/:id/rating", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getRating(id);
    res.json({ result });
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
