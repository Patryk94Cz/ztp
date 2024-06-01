const API_URL = process.env.API_URL+'/api/books';

$(document).ready(function () {
  let isEditMode = false;

  // Load books on page load
  loadBooks();

  // Handle form submission for adding/editing a book
  $('#bookForm').submit(function (event) {
    event.preventDefault();

    const bookData = {
      title: $('#title').val(),
      author: $('#author').val(),
      publisher: $('#publisher').val(),
      year: $('#year').val(),
      isbn: $('#isbn').val(),
      price: $('#price').val()
    };

    if (isEditMode) {
      const bookId = $('#bookId').val();
      updateBook(bookId, bookData);
    } else {
      addBook(bookData);
    }
  });

  // Function to add a new book
  function addBook(bookData) {
    $.ajax({
      type: 'POST',
      url: API_URL,
      contentType: 'application/json',
      data: JSON.stringify(bookData),
      success: function () {
        $('#bookModal').modal('hide');
        loadBooks();
        $('#bookForm')[0].reset();
      },
      error: function (error) {
        console.error('Error:', error);
      }
    });
  }

  // Function to update an existing book
  function updateBook(bookId, bookData) {
    $.ajax({
      type: 'PUT',
      url: `${API_URL}/${bookId}`,
      contentType: 'application/json',
      data: JSON.stringify(bookData),
      success: function () {
        $('#bookModal').modal('hide');
        loadBooks();
        $('#bookForm')[0].reset();
        isEditMode = false;
      },
      error: function (error) {
        console.error('Error:', error);
      }
    });
  }

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
    isEditMode = true;
    // Fetch book data and show in form for editing
    $.get(`${API_URL}/${id}`, function (book) {
      $('#bookId').val(book.id);
      $('#title').val(book.title);
      $('#author').val(book.author);
      $('#publisher').val(book.publisher);
      $('#year').val(book.year);
      $('#isbn').val(book.isbn);
      $('#price').val(book.price);
      
      $('#bookModal').modal('show');
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

  // Reset form and isEditMode flag when modal is closed
  $('#bookModal').on('hidden.bs.modal', function () {
    $('#bookForm')[0].reset();
    isEditMode = false;
  });
});
