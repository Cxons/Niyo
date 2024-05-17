const { drizzle } = require("drizzle-orm/node-postgres");
const pg = require("pg");
require("dotenv").config();
const schemas = require("../src/Schemas/schema");
const connectionUrl = process.env.DATABASE_URL;
const pool = new pg.Pool({
  connectionString: connectionUrl,
});

pool
  .connect()
  .then((port) => {
    console.log(`Db connected successfully at port ${port.port}`);
  })
  .catch((err) => {
    console.log("an error occured", err);
  });

const db = drizzle(pool, { schemas, logger: true });

module.exports = { db };
