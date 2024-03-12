module.exports = (sequelize, DataTypes) => {
    const OverlayText  = sequelize.define("OverlayText ", {
        text: {
            type: DataTypes.STRING,
            allowNull: false
          }
    });
    return OverlayText ;
};
