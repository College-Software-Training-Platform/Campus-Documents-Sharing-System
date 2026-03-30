const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return system_logs.init(sequelize, DataTypes);
}

class system_logs extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    sysLog_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    operator_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_ID'
      }
    },
    action_Type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    action_Time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'system_logs',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "sysLog_ID" },
        ]
      },
      {
        name: "operator_ID",
        using: "BTREE",
        fields: [
          { name: "operator_ID" },
        ]
      },
    ]
  });
  }
}
