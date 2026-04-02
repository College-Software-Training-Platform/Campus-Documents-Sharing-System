const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return resources.init(sequelize, DataTypes);
}

class resources extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    resource_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    uploader_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_ID'
      }
    },
    course_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'courses',
        key: 'course_ID'
      }
    },
    file_Path: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    format: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    file_Size: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    extracted_Text: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ai_Summary: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    required_Points: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    download_Count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    audit_Status: {
      type: DataTypes.ENUM('pending','approved','rejected'),
      allowNull: true,
      defaultValue: "pending"
    },
    upload_Time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'resources',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "resource_ID" },
        ]
      },
      {
        name: "uploader_ID",
        using: "BTREE",
        fields: [
          { name: "uploader_ID" },
        ]
      },
      {
        name: "course_ID",
        using: "BTREE",
        fields: [
          { name: "course_ID" },
        ]
      },
    ]
  });
  }
}
