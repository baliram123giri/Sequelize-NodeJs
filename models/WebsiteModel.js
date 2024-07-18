const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

const Website = sequelize.define("Website", {
    name: {
        type: DataTypes.STRING,
        unique: true,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
})
// Website.sync({ alter: true })
module.exports = Website