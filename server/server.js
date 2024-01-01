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
app.use(cors());
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
      )} et la demande que l'utilisateur te fait. Renvoi SEULEMENT un tableau (je ne veux pas de texte en plus) avec les titres des recettes qui correspondent le mieux à la demande. la demande peut être par temps de préparation. par catégorie de recette et par ingrédients.`,
    });

    //demande utiliasteur
    messages.push({ role: "user", content: searchPrompt });

    const completions = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      format: "json",
    });

    const assistantResponse = completions.choices[0].message.content;
    res.json({ assistantResponse });
  } catch (error) {
    console.error("Error processing request", error);
    res.status(500).send("Internal Server Error");
  }
});

async function fetchRecettesByTitle(recettes) {
  try {
    const recettesArray = JSON.parse(recettes);
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
    const result = await client.query("SELECT * FROM recettes WHERE id = $1", [recetteId]);
    const data = result.rows[0];
    client.release();
    return data;
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
}

app.get("/fetchRecetteById/:id", async (req, res) => {
  const recetteId = req.params.id;
  try {
    const recetteData = await fetchRecetteById(recetteId);
    if (recetteData) {
      res.json({ recetteData });
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
        { role: "system", content: `En te basant sur ces recettes ${JSON.stringify(recettes)}. recommandes toutes celles qui ressemblent à la recette suivante : ${JSON.stringify(recetteTitle)}. renvoi un objet json dont la clè du json est le terme 'recettes'.` },
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
        { role: "system", content: `En te basant sur ces recettes ${JSON.stringify(recettes)}. proposes 5 recette aléatoirs. renvoi un objet json avec uniquement les titres des recettes (je ne veux pas de texte en plus) dont la clè du json est le terme 'recettes'` },
      ],
    });

    result = completions.choices[0].message.content;
    return result;
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  }
}

app.get("/fetchRandomRecipes", async (req, res) => {
  try {
    const randomRecipes = await fetchRandomRecipes();
    res.json({ randomRecipes });
  } catch (error) {
    console.error("Error processing request", error);
    res.status(500).send("Internal Server Error");
  }
});



//* Générer liste de courses
async function generateGroceriesList(ingredients) {
  console.log("ingredient", ingredients);


  try {
    const completions = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `Propose une liste d'ingrédient à acheter en te basant sur ces besoin :   ${JSON.stringify(ingredients)}. renvoi un objet json dont la clè du json est le terme 'ingredients'.` },
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

    const groceries = await generateGroceriesList(ingredients);

    res.json({ groceries });
  } catch (error) {
    console.error("Error processing request", error);
    res.status(500).send("Internal Server Error");
  }
});



app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
