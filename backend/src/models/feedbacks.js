const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return feedbacks.init(sequelize, DataTypes);
}

class feedbacks extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    feedback_ID: {
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending','processed'),
      allowNull: true,
      defaultValue: "pending"
    },
    admin_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'user_ID'
      }
    },
    reply_Content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    submit_Time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'feedbacks',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "feedback_ID" },
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
        name: "admin_ID",
        using: "BTREE",
        fields: [
          { name: "admin_ID" },
        ]
      },
    ]
  });
  }
}
