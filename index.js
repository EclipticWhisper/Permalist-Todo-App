import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
  max: 10, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
});

let items = [];

async function getItems() {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    items = result.rows;
    console.log("Items fetched from database:", items);
  } catch (err) {
    console.log(err);
  }
}

app.get("/", async (req, res) => {
  await getItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query("INSERT INTO items (todo) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
app.post("/edit", (req, res) => {
  const updatedItemId = req.body.updatedItemId;
  const updatedItemTitle = req.body.updatedItemTitle;
  db.query("UPDATE items SET todo = $1 WHERE id = $2", [updatedItemTitle, updatedItemId], (err, result) => {
    if (err) {
      console.error("Error updating item:", err);
      res.status(500).send("Error updating item");
    } else {
      console.log(`Item with ID ${updatedItemId} updated to "${updatedItemTitle}"`);
      res.redirect("/");
    }
  });
});

app.post("/delete", (req, res) => { 
  const deleteItemId = req.body.deleteItemId;
  db.query("DELETE FROM items WHERE id = $1", [deleteItemId], (err, result) => {
    if (err) {
      console.error("Error deleting item:", err);
      res.status(500).send("Error deleting item");
    } else {
      console.log(`Item with ID ${deleteItemId} deleted`);
      res.redirect("/");
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
