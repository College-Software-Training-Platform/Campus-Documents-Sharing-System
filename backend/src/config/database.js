// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// const sequelize = new Sequelize(
//    process.env.DB_NAME || 'campus_sharing_system',
//    process.env.DB_USER || 'root',
//    process.env.DB_PASSWORD || '',

//   {
//     host: process.env.DB_HOST || 'localhost',
//     dialect: 'mysql',
//     define: {
//       underscored: true, 
//       timestamps: false,
//       freezeTableName: true 
//     }
//   }
// );

// module.exports = sequelize;


const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'campus_sharing_system',  // 数据库名
  'root',                   // 数据库用户名
  '123456',  // 直接写入密码
  {
    host: 'localhost',
    dialect: 'mysql',
    define: {
      underscored: true,
      timestamps: false,
      freezeTableName: true
    },
    logging: false
  }
);

module.exports = sequelize;