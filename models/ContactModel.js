const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
const Website = require("./WebsiteModel");

const Contact = sequelize.define("Contact", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: DataTypes.STRING,
    mobile: DataTypes.STRING,
    comment: DataTypes.STRING,
    WebsiteId: DataTypes.INTEGER,
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isArchive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isJunk: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    paranoid: true
})

// Contact.sync({ force: true })
Website.hasMany(Contact, { foreignKey: "WebsiteId" })
Contact.belongsTo(Website)

module.exports = Contact