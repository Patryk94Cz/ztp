const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;