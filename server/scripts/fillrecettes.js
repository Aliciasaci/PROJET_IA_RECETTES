require("dotenv").config();
const fs = require("fs");
const csv = require("csv-parser");
const pgp = require("pg-promise")();
const { dbConfig } = require("../config/database.js");

const db = pgp(dbConfig);

fs.createReadStream("./scripts/csv/recettes.csv")
  .pipe(csv())
  .on("data", (row) => {
    const query =
      "INSERT INTO recettes(titre, ingredients, instructions, tempspreparation, photo) VALUES($1, $2, $3, $4, $5)";
    db.none(query, [
      row.titre,
      row.ingredients,
      row.instructions,
      row.tempspreparation,
      row.photo,
    ]).catch((error) => {
      console.error("Error inserting row", error);
    });
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
  });
