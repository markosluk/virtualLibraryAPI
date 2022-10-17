const config = require("../config/dbConfig.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB, 
    config.USER, 
    config.PASSWORD, 
    {
        host: config.HOST,
        dialect: config.dialect,
        // operatorsAliases: false,
        logging: false,
        pool: {
          max: config.pool.max,
          min: config.pool.min,
          acquire: config.pool.acquire,
          idle: config.pool.idle,
        },
    });

// db creation
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./userModel.js")(sequelize, Sequelize);
db.book = require("./bookModel.js")(sequelize, Sequelize);

// association between users and books
// one-to-many relationship (one user can borrow many books)
db.user.hasMany(db.book)
db.book.belongsTo(db.user)

module.exports = db;
