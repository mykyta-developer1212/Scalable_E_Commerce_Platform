const db = require("./db.js");

async function seed() {
  try {
    console.log("Database already contains data. Nothing to seed.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();