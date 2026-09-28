const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory "database" for the single resource: books
let books = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", year: 2008 },
  { id: 2, title: "The Pragmatic Programmer", author: "Andrew Hunt", year: 1999 },
];
let nextId = 3;

// Returns an error message string, or null if the body is valid.
function validate(body) {
  if (!body || typeof body !== "object") return "Request body must be JSON";
  if (typeof body.title !== "string" || !body.title.trim())
    return "'title' is required and must be a non-empty string";
  if (typeof body.author !== "string" || !body.author.trim())
    return "'author' is required and must be a non-empty string";
  if (body.year !== undefined && !Number.isInteger(body.year))
    return "'year' must be an integer";
  return null;
}

// GET /books - list all
app.get("/books", (req, res) => {
  res.status(200).json(books);
});

// GET /books/:id - get one
app.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.status(200).json(book);
});

// POST /books - create
app.post("/books", (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ error });

  const { title, author, year } = req.body;
  const book = { id: nextId++, title: title.trim(), author: author.trim(), year };
  books.push(book);
  res.status(201).json(book);
});

// PUT /books/:id - replace
app.put("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });

  const error = validate(req.body);
  if (error) return res.status(400).json({ error });

  const { title, author, year } = req.body;
  book.title = title.trim();
  book.author = author.trim();
  book.year = year;
  res.status(200).json(book);
});

// DELETE /books/:id - remove
app.delete("/books/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Book not found" });

  books.splice(index, 1);
  res.status(204).send();
});

// Unknown routes -> JSON 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Malformed JSON and other errors -> JSON
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed")
    return res.status(400).json({ error: "Invalid JSON in request body" });
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}

module.exports = app;
