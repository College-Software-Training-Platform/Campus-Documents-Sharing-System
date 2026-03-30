const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return download_records.init(sequelize, DataTypes);
}

class download_records extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    download_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_ID'
      }
    },
    resource_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'resources',
        key: 'resource_ID'
      }
    },
    deducted_Points: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    download_Time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    ip_Address: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'download_records',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "download_ID" },
        ]
      },
      {
        name: "user_ID",
        using: "BTREE",
        fields: [
          { name: "user_ID" },
        ]
      },
      {
        name: "resource_ID",
        using: "BTREE",
        fields: [
          { name: "resource_ID" },
        ]
      },
    ]
  });
  }
}
