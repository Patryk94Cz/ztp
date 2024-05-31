$(document).ready(function () {
  const API_URL = 'http://localhost:3000/api/books';

  // Load books on page load
  loadBooks();

  // Handle form submission for adding a new book
  $('#bookForm').submit(function (event) {
    event.preventDefault();

    const newBook = {
      title: $('#title').val(),
      author: $('#author').val(),
      publisher: $('#publisher').val(),
      year: $('#year').val(),
      isbn: $('#isbn').val(),
      price: $('#price').val()
    };

    $.ajax({
      type: 'POST',
      url: API_URL,
      contentType: 'application/json',
      data: JSON.stringify(newBook),
      success: function () {
        loadBooks();
        $('#bookForm')[0].reset();
      },
      error: function (error) {
        console.error('Error:', error);
      }
    });
  });

  // Load books from the server
  function loadBooks() {
    $.get(API_URL, function (books) {
      $('#bookTableBody').empty();
      books.forEach(function (book) {
        $('#bookTableBody').append(`
          <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.publisher}</td>
            <td>${book.year}</td>
            <td>${book.isbn}</td>
            <td>${book.price}</td>
            <td>
              <button class="btn btn-warning btn-sm edit-btn" data-id="${book.id}">Edit</button>
              <button class="btn btn-danger btn-sm delete-btn" data-id="${book.id}">Delete</button>
            </td>
          </tr>
        `);
      });

      // Attach event handlers for edit and delete buttons
      $('.edit-btn').click(handleEdit);
      $('.delete-btn').click(handleDelete);
    });
  }

  // Handle edit button click
  function handleEdit() {
    const id = $(this).data('id');
    // Fetch book data and show in form for editing
    $.get(`${API_URL}/${id}`, function (book) {
      $('#title').val(book.title);
      $('#author').val(book.author);
      $('#publisher').val(book.publisher);
      $('#year').val(book.year);
      $('#isbn').val(book.isbn);
      $('#price').val(book.price);
      
      $('#bookForm').off('submit').submit(function (event) {
        event.preventDefault();
        const updatedBook = {
          title: $('#title').val(),
          author: $('#author').val(),
          publisher: $('#publisher').val(),
          year: $('#year').val(),
          isbn: $('#isbn').val(),
          price: $('#price').val()
        };

        $.ajax({
          type: 'PUT',
          url: `${API_URL}/${id}`,
          contentType: 'application/json',
          data: JSON.stringify(updatedBook),
          success: function () {
            loadBooks();
            $('#bookForm')[0].reset();
            $('#bookForm').off('submit').submit(handleAddBook);
          },
          error: function (error) {
            console.error('Error:', error);
          }
        });
      });
    });
  }

  // Handle delete button click
  function handleDelete() {
    const id = $(this).data('id');
    $.ajax({
      type: 'DELETE',
      url: `${API_URL}/${id}`,
      success: function () {
        loadBooks();
      },
      error: function (error) {
        console.error('Error:', error);
      }
    });
  }
});
