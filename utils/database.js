const mysql = require("mysql2");

const pool = mysql.createPool({
  database: "hackathon_basic",
  user: "root",
  password: "",
  host: "localhost",
});

module.exports = pool.promise();
