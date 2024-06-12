const API_URL = 'https://ztp-three.vercel.app/api/books';

$(document).ready(function () {
  let isEditMode = false;
  let booksData = [];

  loadBooks();

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

  function loadBooks() {
    $.get(API_URL, function (books) {
      booksData = books;
      renderBooks(booksData);
    });
  }

  function renderBooks(books) {
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

    $('.edit-btn').click(handleEdit);
    $('.delete-btn').click(handleDelete);
    $('.sort-btn').click(handleSort);
  }

  function handleEdit() {
    const id = $(this).data('id');
    isEditMode = true;
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

  function handleSort() {
    const sortField = $(this).data('sort');
    const sortOrder = $(this).data('order');
    
    console.log(`Sorting by ${sortField} in ${sortOrder} order`); // Debug log

    booksData.sort(function (a, b) {
      if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    console.log('Sorted Data:', booksData); // Debug log

    renderBooks(booksData);
  }

  $('#bookModal').on('hidden.bs.modal', function () {
    $('#bookForm')[0].reset();
    isEditMode = false;
  });
});
