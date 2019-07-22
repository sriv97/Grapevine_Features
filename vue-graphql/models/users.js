'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    id: DataTypes.INTEGER,
    displayName: DataTypes.STRING,
    title: DataTypes.STRING,
    company: DataTypes.STRING,
    location: DataTypes.STRING,
  }, {});
  Users.associate = function(models) {
    // associations can be defined here
  };
  return Users;
};
