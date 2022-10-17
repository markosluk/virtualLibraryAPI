module.exports = (sequelize, Sequelize) => {
    const Book = sequelize.define("books", {
            title: {
            type: Sequelize.STRING
            },
            ISBN: {
            type: Sequelize.STRING
            },
            author: {
            type: Sequelize.STRING
            }
        }, {
            timestamps: false
          });
    return Book;
    };