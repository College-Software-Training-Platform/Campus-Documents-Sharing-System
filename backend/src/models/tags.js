const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return tags.init(sequelize, DataTypes);
}

class tags extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    tag_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tag_Name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: "tag_Name"
    }
  }, {
    sequelize,
    tableName: 'tags',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "tag_ID" },
        ]
      },
      {
        name: "tag_Name",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "tag_Name" },
        ]
      },
    ]
  });
  }
}
