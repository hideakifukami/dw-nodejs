const Sequelize = require("sequelize")
const sequelize = new Sequelize("projeto-handlebars", "root", "", {
    host: "localhost",
    dialect: "mysql",
    define: {
        timestamps: false,
      },
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}