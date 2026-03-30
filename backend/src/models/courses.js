const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return courses.init(sequelize, DataTypes);
}

class courses extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return super.init({
    course_ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    course_Name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    college: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'courses',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "course_ID" },
        ]
      },
    ]
  });
  }
}
