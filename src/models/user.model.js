module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
       username: {
         type: DataTypes.STRING,
         allowNull: false,
         unique: true
       },
       email: {
         type: DataTypes.STRING,
      },
       password: {
         type: DataTypes.STRING,
         allowNull: false
       }
    });
    return User;
};
