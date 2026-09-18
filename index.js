import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const MAX_ITEM_LENGTH = 100;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
  max: 10,
  idleTimeoutMillis: 30000,
});

function sanitizeItem(value) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, MAX_ITEM_LENGTH);
}

async function getItems() {
  const result = await db.query("SELECT id, todo FROM items ORDER BY id ASC");
  return result.rows;
}

app.get("/", async (req, res, next) => {
  try {
    const items = await getItems();
    const error = req.query.error === "empty" ? "Please enter a task before submitting." : null;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
      error,
    });
  } catch (err) {
    next(err);
  }
});

app.post("/add", async (req, res, next) => {
  const item = sanitizeItem(req.body.newItem);
  if (!item) {
    return res.redirect("/?error=empty");
  }
  try {
    await db.query("INSERT INTO items (todo) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

app.post("/edit", async (req, res, next) => {
  const id = Number(req.body.updatedItemId);
  const title = sanitizeItem(req.body.updatedItemTitle);
  if (!title) {
    return res.redirect("/?error=empty");
  }
  try {
    await db.query("UPDATE items SET todo = $1 WHERE id = $2", [title, id]);
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

app.post("/delete", async (req, res, next) => {
  const id = Number(req.body.deleteItemId);
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.error("Unexpected error:", err);
  res.status(500).send("Something went wrong. Please try again.");
});

app.listen(port, () => {
  console.log(`Permalist is running at http://localhost:${port}`);
});
