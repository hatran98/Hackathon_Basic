const express = require("express");
const app = express();
const port = 3000;
const morgan = require("morgan");
const bodyParser = require("body-parser");
const pool = require("./utils/database");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.post("/users", async (req, res) => {
  const { name, email, age } = req.body;
  try {
    const data = await pool.execute(
      "INSERT INTO users (name,email,age) VALUES (?,?,?)",
      [name, email, age]
    );
    res.json({ message: "Create User Successfully" });
  } catch (error) {
    console.log(error);
  }
});
app.get("/users", async (req, res) => {
  try {
    const data = await pool.execute("SELECT * from users");
    let [row] = data;
    res.json({
      status: "success",
      users: row,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await pool.execute("SELECT * FROM users where id =?", [id]);

    let [row] = data;
    if (row.length > 0) {
      res.json({
        status: "success",
        user: row,
      });
    } else {
      res.json({
        message: "User not Found",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

app.patch("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;
    const data = await pool.execute("SELECT * FROM users where id =?", [id]);
    const [row] = data;
    if (row.length > 0) {
      await pool.execute(
        "UPDATE users SET name = ? , email = ? , age = ? where id =? ",
        [name, email, age, id]
      );
      res.json({ status: "success", message: "Update user Successfully" });
    } else {
      res.json({
        status: "error",
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
});
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await pool.execute("SELECT * FROM users where id =?", [id]);
    const [row] = data;
    if (row.length > 0) {
      await pool.execute("DELETE FROM users where id =?", [id]);
      res.json({ status: "successs", message: "Delete User Successfully" });
    } else {
      res.json({
        status: "error",
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
  }
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
