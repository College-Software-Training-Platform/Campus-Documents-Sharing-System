const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return points_logs.init(sequelize, DataTypes);
}

class points_logs extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    log_ID: {
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
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reason: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ref_ID: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    create_Time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'points_logs',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "log_ID" },
        ]
      },
      {
        name: "user_ID",
        using: "BTREE",
        fields: [
          { name: "user_ID" },
        ]
      },
    ]
  });
  }
}
