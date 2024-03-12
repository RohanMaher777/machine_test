
require('dotenv').config()
const { DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME } = process.env
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false
})

try {
   sequelize.authenticate();
   console.log("connection has been successfully ");
} catch (error) {
   console.error("connection has been unable ");
}

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sequelize.sync({ alter: true });

//module table
db.User = require("../../src/models/user.model")(sequelize, DataTypes);
db.image = require("../../src/models/image.model")(sequelize,DataTypes);
db.overlayText = require("../../src/models/overlayText.model")(sequelize,DataTypes);


// User and Image has the One to Many relationship
db.User.hasMany(db.image, {
   forienKey : "UserId",
   as : "image"
})
db.image.belongsTo(db.User, {
   forienKey : "UserId",
   as : "User" 
})

module.exports = db;
