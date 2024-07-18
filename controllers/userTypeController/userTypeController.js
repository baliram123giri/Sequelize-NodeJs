const UserType = require("../../models/UserTypeModel");
const { errorRequest } = require("../../utils/Helper");
const { createUserTypeValidation, updateUserTypeValidation } = require("./validation");

//create a new UserType
async function createUserType({ body }, res) {
    try {
        await createUserTypeValidation.validateAsync(body)
        const usertype = await UserType.create(body)
        return res.json(usertype)
    } catch (error) {
        await errorRequest(res, error)
    }
}
//get a new UserType
async function listUserType({ }, res) {
    try {
        const data = await UserType.findAll({ attributes: ["name", "id"] })
        return res.json(data)
    } catch (error) {
        await errorRequest(res, error)
    }
}

//update a userType
async function updateUserType({ body, params: { id } }, res) {
    try {
        await updateUserTypeValidation.validateAsync(body)
        const userType = await UserType.findOne({ where: { id: Number(id) } })
        if (!userType) return res.status(404).json({ message: "User not found" })
        //update
        const data = await UserType.update(body, { where: { id: userType.id } })
        return res.json(data)
    } catch (error) {
        await errorRequest(res, error)
    }
}

//single userType
async function singleUserType({ params: { id } }, res) {
    try {
        const data = await UserType.findOne({ where: { id: Number(id) } })
        return res.json(data)
    } catch (error) {
        await errorRequest(res, error)
    }
}

//delete
async function deleteUserType({ params: { id } }, res) {
    try {
        const userType = await UserType.findOne({ where: { id: Number(id) } })
        if (!userType) return res.status(404).json({ message: "User not found" })
        await UserType.destroy({ where: { id: userType.id } })
        return res.json({ message: "User deleted" })
    } catch (error) {
        await errorRequest(res, error)
    }
}
module.exports = { createUserType, updateUserType, deleteUserType, listUserType, singleUserType }