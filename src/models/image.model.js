module.exports = (sequelize, DataTypes) => {
    const image = sequelize.define("image", {
        url: {
            type: DataTypes.STRING,
            allowNull: false
          },
        
    });
    return image;
};
