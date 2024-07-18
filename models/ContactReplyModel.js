const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
const Contact = require("./ContactModel");

const ContactEmailReply = sequelize.define("ContactEmailReply", {
    contactId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false
    },
})

// ContactEmailReply.sync({ force: true })
Contact.hasOne(ContactEmailReply, { foreignKey: "contactId" })
ContactEmailReply.belongsTo(Contact)
module.exports = ContactEmailReply