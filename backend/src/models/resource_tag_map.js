const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return resource_tag_map.init(sequelize, DataTypes);
}

class resource_tag_map extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    resource_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'resources',
        key: 'resource_ID'
      }
    },
    tag_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tags',
        key: 'tag_ID'
      }
    }
  }, {
    sequelize,
    tableName: 'resource_tag_map',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "resource_ID" },
          { name: "tag_ID" },
        ]
      },
      {
        name: "tag_ID",
        using: "BTREE",
        fields: [
          { name: "tag_ID" },
        ]
      },
    ]
  });
  }
}
