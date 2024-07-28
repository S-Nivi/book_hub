module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    books: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    liked: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    bought: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    profile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Users;
};
