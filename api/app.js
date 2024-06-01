const express = require('express');
const bodyParser = require('body-parser');
const bookRoutes = require('./bookRoutes');
const sequelize = require('./dbConfig');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api', bookRoutes);

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(error => {
    console.error('Error synchronizing the database:', error);
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
