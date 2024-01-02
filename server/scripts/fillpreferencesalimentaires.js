require("dotenv").config();
const fs = require("fs");
const csv = require("csv-parser");
const pgp = require("pg-promise")();
const { dbConfig } = require("../config/database.js");

const db = pgp(dbConfig);

fs.createReadStream("./scripts/csv/preferences_alimentaires.csv")
  .pipe(csv())
  .on("data", (row) => {
    const query =
      "INSERT INTO preferences_alimentaires(categorie_id, titre) VALUES($1, $2)";
    db.none(query, [
      row.categorie_id,
      row.titre,
    ]).catch((error) => {
      console.error("Error inserting row", error);
    });
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
  });
