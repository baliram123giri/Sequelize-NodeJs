
const ContactEmail = require("../../models/ContactEmailModel");
const User = require("../../models/UsersModel");
const Website = require("../../models/WebsiteModel");
const {
    errorRequest,
    pagination,
    getColumnsKeys,
    metaData,
    successResponseToken,
} = require("../../utils/Helper");

const {
    createContactEmailValidation,
    updateContactEmailValidation,
} = require("./validation");

//create a new ContactEmail
async function createContactEmail({ body }, res) {
    try {
        await createContactEmailValidation.validateAsync(body);
        const contactEmail = await ContactEmail.create(body);
        return res.json(await successResponseToken(contactEmail, res));
    } catch (error) {
        await errorRequest(res, error);
    }
}

//get a new ContactEmail
async function listContactEmail({ query }, res) {
    try {
        const user = await User.findByPk(res.userId)
        const { limit, page, panginationSchema, rangeSearch } = await pagination(
            query
        );
        const globleSearch = await getColumnsKeys(ContactEmail, query?.search);
        const { count, rows: data } = await ContactEmail.findAndCountAll({
            where: {
                ...(res.role === "super admin" ? {} : { WebsiteId: user.WebsiteId }),
                //global search
                ...(query?.search
                    ? {
                        [Op.or]: globleSearch,
                    }
                    : {}),
                //range search
                ...rangeSearch,
            },
            include: [{
                model: Website,
                attributes: ["name"]
            }],
            ...panginationSchema,
        });
        return res.json(await metaData(data, page, count, limit, res));
    } catch (error) {
        await errorRequest(res, error);
    }
}

//update a ContactEmail
async function updateContactEmail({ body, params: { id } }, res) {
    try {
        await updateContactEmailValidation.validateAsync(body, { allowUnknown: true });
        const contactEmail = await ContactEmail.findOne({ where: { id: Number(id) } });
        if (!contactEmail) return res.status(404).json({ message: "ContactEmail not found" });
        //update
        const data = await ContactEmail.update(body, { where: { id: contactEmail.id } });
        return res.json(
            await successResponseToken(data, res, "Updated Successfully")
        );
    } catch (error) {
        await errorRequest(res, error);
    }
}

//single ContactEmail
async function singleContactEmail({ params: { id } }, res) {
    try {
        const data = await ContactEmail.findOne({ where: { id: Number(id) } });
        return res.json(await successResponseToken(data, res));
    } catch (error) {
        await errorRequest(res, error);
    }
}
//get ContactEmail with user id
async function usersContactEmail({ }, res) {
    try {
        const data = await ContactEmail.findAll({
            ///if it is super admin shows all ContactEmails
            ...(res.role === "super admin" ? {} : {
                include: [{
                    model: User,
                    where: {
                        ///if it is super admin shows all ContactEmails
                        ...(res.role === "super admin" ? {} : { id: res.userId })
                    },
                    attributes: []
                }],
            }),
            attributes: [
                "id",
                "name",
            ],
        });
        return res.json(await successResponseToken(data || [], res));
    } catch (error) {
        await errorRequest(res, error);
    }
}

//delete
async function deleteContactEmail({ params: { id } }, res) {
    try {
        const contactEmail = await ContactEmail.findOne({ where: { id: Number(id) } });
        if (!contactEmail) return res.status(404).json({ message: "ContactEmail not found" });
        await ContactEmail.destroy({ where: { id: contactEmail.id } });
        return res.json(
            await successResponseToken(undefined, res, "Deleted Successfully")
        );
    } catch (error) {
        await errorRequest(res, error);
    }
}

module.exports = {
    createContactEmail,
    updateContactEmail,
    deleteContactEmail,
    listContactEmail,
    singleContactEmail,
    usersContactEmail,
};
