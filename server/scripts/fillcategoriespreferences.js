require("dotenv").config();
const fs = require("fs");
const csv = require("csv-parser");
const pgp = require("pg-promise")();
const { dbConfig } = require("../config/database.js");

const db = pgp(dbConfig);

fs.createReadStream("./scripts/csv/categories_preferences.csv")
  .pipe(csv())
  .on("data", (row) => {
    const query =
      "INSERT INTO categories_preferences(titre) VALUES($1)";
    db.none(query, [
      row.titre,
    ]).catch((error) => {
      console.error("Error inserting row", error);
    });
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
  });
