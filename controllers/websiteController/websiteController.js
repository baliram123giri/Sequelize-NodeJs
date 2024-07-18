const { sequelize } = require("../../models");
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
    createWebsiteValidation,
    updateWebsiteValidation,
} = require("./validation");

//create a new Website
async function createWebsite({ body }, res) {
    try {
        await createWebsiteValidation.validateAsync(body);
        const website = await Website.create(body);
        return res.json(await successResponseToken(website, res));
    } catch (error) {
        await errorRequest(res, error);
    }
}
//get a new Website
async function listWebsite({ query }, res) {
    try {
        const isDropdown = query?.isDropdown
        const { limit, page, panginationSchema, rangeSearch } = await pagination(
            query
        );
        const globleSearch = await getColumnsKeys(Website, query?.search);
        const { count, rows: data } = await Website.findAndCountAll({
            where: {
                //global search
                ...(query?.search
                    ? {
                        [Op.or]: globleSearch,
                    }
                    : {}),
                ...(isDropdown ? { is_active: true, } : {}),
                //range search
                ...rangeSearch,
            },
            ...panginationSchema,
        });
        return res.json(await metaData(data, page, count, limit, res));
    } catch (error) {
        await errorRequest(res, error);
    }
}

//update a Website
async function updateWebsite({ body, params: { id } }, res) {
    try {
        await updateWebsiteValidation.validateAsync(body, { allowUnknown: true });
        const website = await Website.findOne({ where: { id: Number(id) } });
        if (!website) return res.status(404).json({ message: "Website not found" });
        //update
        const data = await website.update(body, { where: { id: website.id } });
        return res.json(
            await successResponseToken(data, res, "Updated Successfully")
        );
    } catch (error) {
        await errorRequest(res, error);
    }
}

//single Website
async function singleWebsite({ params: { id } }, res) {
    try {
        const data = await Website.findOne({ where: { id: Number(id) } });
        return res.json(await successResponseToken(data, res));
    } catch (error) {
        await errorRequest(res, error);
    }
}
//get website with user id
async function usersWebsite({ }, res) {
    try {
        const data = await Website.findAll({
            ///if it is super admin shows all websites
            ...(res.role === "super admin" ? {} : {
                include: [{
                    model: User,
                    where: {
                        ///if it is super admin shows all websites
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
async function deleteWebsite({ params: { id } }, res) {
    try {
        const website = await Website.findOne({ where: { id: Number(id) } });
        if (!website) return res.status(404).json({ message: "Website not found" });
        await Website.destroy({ where: { id: website.id } });
        return res.json(
            await successResponseToken(undefined, res, "Deleted Successfully")
        );
    } catch (error) {
        await errorRequest(res, error);
    }
}
module.exports = {
    createWebsite,
    updateWebsite,
    deleteWebsite,
    listWebsite,
    singleWebsite,
    usersWebsite,
};
