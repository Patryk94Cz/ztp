const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./dbConfig');  // Załóżmy, że masz już skonfigurowane połączenie z bazą danych

const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  publisher: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER
  },
  isbn: {
    type: DataTypes.STRING(13),  // Przyjmując, że ISBN ma 13 cyfr
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),  // Precyzja ceny, np. 99999.99
    allowNull: false
  }
}, {
  timestamps: false  // Wyłączenie domyślnego dodawania kolumn createdAt i updatedAt
});

module.exports = Book;
