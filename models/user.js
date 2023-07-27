const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {}
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        // Validation rules...
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        // Validation rules...
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        // Validation rules...
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        // Validation rules...
      },
    },
    { sequelize }
  );

    User.associate = (models) => {
        User.hasMany(models.Course, {
            as: 'user',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false,
            },
        });
    };
    

  return User;
};
