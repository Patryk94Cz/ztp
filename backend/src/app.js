const express = require('express');
const bodyParser = require('body-parser');
const bookRoutes = require('./bookRoutes');
const sequelize = require('./dbConfig');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/api', bookRoutes);

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`App running on port ${port}`);
  });
});
