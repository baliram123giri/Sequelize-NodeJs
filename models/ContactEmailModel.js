const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
const Website = require("./WebsiteModel");


const ContactEmail = sequelize.define("ContactEmail", {
    WebsiteId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    smtp_host: {
        type: DataTypes.STRING,
        allowNull: false
    },
    smtp_port: {
        type: DataTypes.STRING,
        allowNull: false
    },
    smtp_service: {
        type: DataTypes.STRING,
        allowNull: false
    },
    smtp_password: {
        type: DataTypes.STRING,
        allowNull: false
    },
})

// ContactEmail.sync({ alter: true })
Website.hasMany(ContactEmail, { foreignKey: "WebsiteId" })
ContactEmail.belongsTo(Website)

module.exports = ContactEmail