const express = require("express");
const router = express.Router();

const pool = require("../modules/pool");

// Get all books
router.get("/", (req, res) => {
  let queryText = 'SELECT * FROM "books" ORDER BY "title";';
  pool
    .query(queryText)
    .then((result) => {
      // Sends back the results in an object
      res.send(result.rows);
    })
    .catch((error) => {
      console.log("error getting books", error);
      res.sendStatus(500);
    });
});

// Adds a new book to the list of awesome reads
// Request body must be a book object with a title and author.
router.post("/", (req, res) => {
  let newBook = req.body;
  console.log(`Adding book`, newBook);

  let queryText = `INSERT INTO "books" ("author", "title")
                   VALUES ($1, $2);`;
  pool
    .query(queryText, [newBook.author, newBook.title])
    .then((result) => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.log(`Error adding new book`, error);
      res.sendStatus(500);
    });
});

// TODO - PUT
// Updates a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
// Request body must include the content to update - the status
router.put("/:bookid/isRead", (req, res) => {
  const bookid = req.params.bookid;
  const isRead = (req.body.isRead === 'true'); // this is checking and converting it to a true boolean
  let queryText = "";
  console.log(req.body);
  
  if (isRead == true) {
    queryText = 'UPDATE "books" SET "isRead"=true WHERE id=$1 RETURNING *;';
  }
  console.log(isRead);
  

  console.log(bookid, isRead);
  pool
    .query(queryText, [bookid])
    .then((result) => {
      res.send(result.rows);
    })
    .catch((err) => {
      console.log(`Error making query: ${queryText}`, err);
      res.sendStatus(500);
    });
});

// TODO - DELETE
// Removes a book to show that it has been read
// Request must include a parameter indicating what book to update - the id
router.delete("/:bookid", (req, res) => {
  console.log(req.body);
  console.log(req.params);
  const idToGet = req.params.bookid;
  console.log(idToGet);

  const queryText = 'DELETE FROM "books" WHERE id=$1';
  pool
    .query(queryText, [idToGet]) // why does the idToGet variable need to be in brackets?[]
    .then((result) => {
      console.log(`Deleted book with id ${idToGet}`);
      res.sendStatus(204);
    })
    .catch((err) => {
      console.log(`Error making query: ${queryText}`, err);
      res.sendStatus(500);
    });
});

module.exports = router;
