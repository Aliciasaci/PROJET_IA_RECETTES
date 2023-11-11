const express = require("express");
const OpenAI = require("openai");
const app = express();
const { Pool } = require("pg");
const { dbConfig } = require("./config/database.js");
const pool = new Pool(dbConfig);
const port = 5000;
require("dotenv").config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const cors = require("cors");

app.use(cors());
app.use(express.json());

async function fetchRecettes() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM recette");
    let data = result.rows;
    client.release();
    return data;
  } catch (error) {
    console.error("Error executing query", error);
  }
}

app.post("/generate", async (req, res) => {
  const searchPrompt = req.body.searchPrompt;
  try {
    const recettes = await fetchRecettes();

    const messages = [];
    recettes.forEach((recette) => {
      messages.push({
        role: "system",
        content: `Tu es une IA qui généres des recettes en te basant sur ces données ${JSON.stringify(
          recette
        )} et la demande que l'utilisateur te fait. Renvoi un Objet json avec le nom, la recette, les ingrédient, la photo et les catégories. N'utilise aucun ingrédient qui ne provient pas de ce que l'utilisateur ta donné.
      Il faut que la recette reprennent exactement les mêmes ingrédients donnés.Si les données ne permettent pas de générer la recette, réponds que tu n'a aucune donnée pour faire ça.`,
      });
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

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
