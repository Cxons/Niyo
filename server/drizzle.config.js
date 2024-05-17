const { defineConfig } = require("drizzle-kit");
const { pgSchema } = require("drizzle-orm/pg-core");
require("dotenv").config();

const config = defineConfig({
  schema: "./src/Schemas/schema.js",
  out: "./src/schemas/migrations",
  driver: "pg",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});

module.exports = config;
