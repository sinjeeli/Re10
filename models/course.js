const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}
  Course.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        // Validation rules...
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        // Validation rules...
      },
      estimatedTime: {
        type: DataTypes.STRING,
        // Validation rules...
      },
      materialsNeeded: {
        type: DataTypes.STRING,
        // Validation rules...
      },
    },
    { sequelize }
  );

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };

  return Course;
};
