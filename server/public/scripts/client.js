$(document).ready(function () {
  console.log("jQuery sourced.");
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $("#submitBtn").on("click", handleSubmit);

  // TODO - Add code for edit & delete buttons
  $("#bookShelf").on("click", ".delete", deleteBook);
  $('#bookShelf').on('click', ".isRead", updateBook);
}

function updateBook(event) {
  const bookid = $(event.target).data("bookid");

  $.ajax({
    method: "PUT",
    url: `/books/${bookid}/isRead`,
    data: {isRead: true}
  }).then(function(response) {
    refreshBooks();
  }).catch(function(error) {
    console.log('Error marking as read', error);
    
  })
}

function deleteBook(event) {
  console.log(event.target);
  const bookid = $(event.target).data("bookid");
  console.log("deleting a book with id of: ", bookid);
  $.ajax({
    url: `/books/${bookid}`,
    method: "DELETE",
  })
    .then(function (serverResponse) {
      refreshBooks();
    })
    .catch(function (error) {
      console.log("Error in deleting book", error);
    });
}

function handleSubmit() {
  console.log("Submit button clicked.");
  let book = {};
  book.author = $("#author").val();
  book.title = $("#title").val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: "POST",
    url: "/books",
    data: bookToAdd,
  })
    .then(function (response) {
      console.log("Response from server.", response);
      refreshBooks();
    })
    .catch(function (error) {
      console.log("Error in POST", error);
      alert("Unable to add book at this time. Please try again later.");
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: "GET",
    url: "/books",
  })
    .then(function (response) {
      console.log(response);
      renderBooks(response);
    })
    .catch(function (error) {
      console.log("error in GET", error);
    });
}

// Displays an array of books to the DOM
function renderBooks(books) {
  $("#bookShelf").empty();
  for (let i = 0; i < books.length; i += 1) {
    let book = books[i];
    let read = 'Mark as read';
    if (book.isRead == true) {
      read = 'Read it!';
    } 
    // For each book, append a new row to our table
    $("#bookShelf").append(`
      <tr>
        <td><button data-bookid=${book.id} class="isRead">${read}</button></td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td><button class="delete" data-bookid=${book.id}>Delete</button></td>
      </tr>
    `);
  }
}
