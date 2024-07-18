const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
const User = require("./UsersModel");

const UserType = sequelize.define('UserType', {
    name: {
        type: DataTypes.STRING,
        unique: true,
    }
})

// UserType.sync({ alter: true })
UserType.hasMany(User, { foreignKey: "UserTypeId" })
User.belongsTo(UserType)

module.exports = UserType