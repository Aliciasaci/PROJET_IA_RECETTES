const express = require('express');
const OpenAI = require('openai');
const app = express();
const { Pool } = require('pg');
const { dbConfig } = require('./config/database.js');
const pool = new Pool(dbConfig);
const port = 5000;
const openai = new OpenAI({ apiKey: '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' });

async function fetchRecettes() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM recette');
    let data = result.rows;
    client.release();
    return data;
  } catch (error) {
    console.error('Error executing query', error);
  }
}

app.get('/', async (req, res) => {
  try {
    const recettes = await fetchRecettes();
    console.log(recettes);

    const messages = [
      { role: 'assistant', content: 'You are an IA that generated recipes based on the data the user gives you.' },
    ];

    recettes.forEach((recette) => {
      messages.push({ role: 'user', content: `use this to create a recipe: ${JSON.stringify(recette)}` });
    });

    const completions = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
    });

    const assistantResponse = completions.choices[0].message.content;
    res.json({ assistantResponse });
  } catch (error) {
    console.error('Error processing request', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
