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

app.use(cors());
app.use(express.json());

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
      )} et la demande que l'utilisateur te fait. Renvoi SEULEMENT un tableau (je ne veux pas de texte en plus) avec les titres des recettes qui correspondent le mieux à la demande.`,
    });

    //demande utiliasteur
    messages.push({ role: "user", content: searchPrompt });

    const completions = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
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
    console.log(recettes);
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

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
