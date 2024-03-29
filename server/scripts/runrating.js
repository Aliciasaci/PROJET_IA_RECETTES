require("dotenv").config();
const fs = require("fs");
const pgp = require("pg-promise")();
const { dbConfig } = require("../config/database.js");

const db = pgp(dbConfig);

const sql = fs
  .readFileSync("./scripts/sql/create_rating_table.sql")
  .toString();

db.none(sql)
  .then(() => {
    console.log("SQL file executed successfully");
    pgp.end();
  })
  .catch((error) => {
    console.error("Error executing SQL file", error);
  });
