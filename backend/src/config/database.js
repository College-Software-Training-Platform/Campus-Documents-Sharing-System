const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'campus_sharing_system',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    define: {
      underscored: true, 
      timestamps: false,
      freezeTableName: true 
    }
  }
);

module.exports = sequelize;
