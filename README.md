# Task 02 — REST API with Express

A small REST API built with Express that supports the four standard operations
(GET, POST, PUT, DELETE) over one resource: **books**. Requests and responses
are JSON, and missing records return proper error status codes.

## Run it

Requires Node.js 18+.

```bash
npm install
npm start
```

The server starts on `http://localhost:3000` (set `PORT` to change it).

## Endpoints

| Method | Route        | Description        | Success | Errors        |
|--------|--------------|--------------------|---------|---------------|
| GET    | `/books`     | List all books     | 200     | —             |
| GET    | `/books/:id` | Get one book       | 200     | 404           |
| POST   | `/books`     | Create a book      | 201     | 400           |
| PUT    | `/books/:id` | Replace a book     | 200     | 400, 404      |
| DELETE | `/books/:id` | Delete a book      | 204     | 404           |

A book looks like:

```json
{ "id": 1, "title": "Clean Code", "author": "Robert C. Martin", "year": 2008 }
```

`title` and `author` are required strings; `year` is an optional integer.

## Try it with curl

```bash
# list
curl http://localhost:3000/books

# get one
curl http://localhost:3000/books/1

# create
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Refactoring","author":"Martin Fowler","year":1999}'

# update
curl -X PUT http://localhost:3000/books/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Clean Code (2nd ed.)","author":"Robert C. Martin","year":2008}'

# delete
curl -X DELETE http://localhost:3000/books/1

# missing record -> 404
curl -i http://localhost:3000/books/999
```

## Decisions I made

- **In-memory storage:** data lives in an array, so it resets when the server
  restarts. This keeps the task simple; swapping in a database later would only
  touch the route handlers.
- **PUT replaces the whole record**, so it requires the same fields as POST
  (`title` and `author`). Partial updates would be PATCH.
- **Status codes:** 201 for create, 204 (no body) for delete, 404 for a missing
  record or unknown route, 400 for invalid input or malformed JSON.
- **Validation is minimal** but enough to stop bad data getting in.
