require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres",
    // dialectOptions: {
    //   ssl: {
    //     rejectUnauthorized: false,
    //   },
    // },
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_NAME}_test`,
    host: process.env.DB_HOST,
    dialect: "postgres",
  },
  production: {
    username: "default",
    password: "cgZXNF5wfp1x",
    database: "verceldb",
    host: "ep-ancient-butterfly-528936-pooler.us-east-1.postgres.vercel-storage.com",
    dialect: "postgres",
    // dialectOptions: {
    //   ssl: {
    //     rejectUnauthorized: false,
    //   },
    // },
  },
};
