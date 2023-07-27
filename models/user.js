const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class User extends Sequelize.Model {
    // Static method to authenticate users based on their credentials
    static async authenticate(emailAddress, password) {
      // Find the user by the provided emailAddress
      const user = await this.findOne({ where: { emailAddress } });

      // If the user exists and the provided password matches the user's password,
      // return the authenticated user; otherwise, return null
      if (user && bcrypt.compareSync(password, user.password)) {
        return user;
      } else {
        return null;
      }
    }
  }

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
        validate: {
          notEmpty: true,
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
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


