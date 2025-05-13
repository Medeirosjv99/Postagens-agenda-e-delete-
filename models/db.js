const Sequelize = require("sequelize");
// Conexão com Banco de Dados
    const sequelize = new Sequelize("postapp", "root", "Toninho123", {
    host: "localhost",
    dialect: "mysql"
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}