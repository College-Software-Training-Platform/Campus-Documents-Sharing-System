const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return users.init(sequelize, DataTypes);
}

class users extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    user_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    account: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "account"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin','user'),
      allowNull: true,
      defaultValue: "user"
    },
    points_Balance: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    contact: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    account_Status: {
      type: DataTypes.ENUM('active','banned'),
      allowNull: true,
      defaultValue: "active"
    },
    register_Time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",                                                                                             
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_ID" },
        ]
      },
      {
        name: "account",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "account" },
        ]
      },
    ]
  });
  }
}
