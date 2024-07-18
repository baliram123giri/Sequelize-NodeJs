
const { compareSync } = require("bcrypt");
const UserType = require("../../models/UserTypeModel");
const User = require("../../models/UsersModel");
const { errorRequest, dateRangeSelection, pagination, getColumnsKeys, metaData, successResponseToken } = require("../../utils/Helper");
const { genarateToken } = require("../../utils/auth");
const { createUserValidation, updateUserValidation, loginUserValidations } = require("./validation");
const { Op } = require("sequelize");
const Website = require("../../models/WebsiteModel");

//create a new User
async function createUser({ body }, res) {
    try {
        await createUserValidation.validateAsync(body)
        const user = await User.create(body)
        return res.json(await successResponseToken(user, res, "User Addedd Successfully"))
    } catch (error) {
        await errorRequest(res, error)
    }
}

//get a new User
async function listUser({ query }, res) {
    try {
        const { limit, page, panginationSchema, rangeSearch } = await pagination(query)
        const globleSearch = await getColumnsKeys(User, query?.search)

        const { count, rows: data } = await User.findAndCountAll({
            where: {
                //global search 
                ...(query?.search ? {
                    [Op.or]: [...globleSearch, {
                        "$UserType.name$": { [Op.like]: `%${query?.search}%` }
                    }]
                } : {}),
                id: { [Op.notLike]: res.userId },
                //range search
                ...rangeSearch,

            },
            attributes: {
                exclude: ["password"]
            },
            include: [{
                model: UserType,
                attributes: ["name"]
            }, {
                model: Website,
                attributes: ["name"]
            }
            ],
            ...panginationSchema,
        })
        return res.json(await metaData(data, page, count, limit, res));
    } catch (error) {
        await errorRequest(res, error)
    }
}

//update a User
async function updateUser({ body, params: { id } }, res) {
    try {
        await updateUserValidation.validateAsync(body, { allowUnknown: true })
        const user = await User.findOne({ where: { id: Number(id) } })
        if (!user) return res.status(404).json({ message: "User not found" })
        //update
        await User.update(body, { where: { id: user.id } })
        return res.json({ data: { ...body }, message: "User updated successfully" })
    } catch (error) {
        await errorRequest(res, error)
    }
}

//single User
async function singleUser({ params: { id } }, res) {
    try {
        const data = await User.findOne({ where: { id: Number(id) } })
        return res.json(data)
    } catch (error) {
        await errorRequest(res, error)
    }
}

//delete
async function deleteUser({ params: { id } }, res) {
    try {
        const user = await User.findOne({ where: { id: Number(id) } })
        if (!user) return res.status(404).json({ message: "User not found" })
        await User.destroy({ where: { id: user.id } })
        return res.json({ message: "User deleted" })
    } catch (error) {
        await errorRequest(res, error)
    }
}

//login user
async function loginUser({ body }, res) {
    try {
        await loginUserValidations.validateAsync(body)
        const user = await User.findOne({
            where: { email: body.email }, include: [{
                model: UserType,
                attributes: ["name"],
            }, { model: Website, attributes: ["name"] }]
        })
        if (!user) return res.status(500).json({ message: 'Email or password wrong' })
        //check password
        const isVerified = compareSync(body.password, user.password)
        if (!isVerified) return res.status(500).json({ message: 'Email or password wrong' })

        const data = JSON.parse(JSON.stringify(user))
        data.password = undefined
        //create jwt token
        const token = genarateToken({ id: user.id, role: user.UserType?.name })

        return res.json({ data, token });
    } catch (error) {
        errorRequest(res, error);
    }
}

module.exports = { createUser, updateUser, deleteUser, listUser, singleUser, loginUser }