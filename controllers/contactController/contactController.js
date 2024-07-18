const { Op } = require("sequelize");
const Contact = require("../../models/ContactModel");
const Website = require("../../models/WebsiteModel");
const { errorRequest, pagination, getColumnsKeys, metaData, successResponseToken } = require("../../utils/Helper");
const { createContactValidation, updateContactValidation } = require("./validation");
const User = require("../../models/UsersModel");
const ContactEmail = require("../../models/ContactEmailModel");
const ContactEmailReply = require("../../models/ContactReplyModel");

//create a new Contact
async function createContact({ body, params: { websitename } }, res) {
    try {
        const isWebsitename = await Website.findOne({ where: { name: websitename } })
        if (!isWebsitename) return res.status(404).json({ message: "Website not found" })
        await createContactValidation.validateAsync(body)
        const contact = await Contact.create({ ...body, WebsiteId: isWebsitename.id })

        return res.json(await successResponseToken(contact, res, "Successfully Sent"))
    } catch (error) {
        await errorRequest(res, error)
    }
}

async function getCountContact({ query }, res) {
    try {
        const website = query?.website
        if (!website) {
            return res.status(404).json({ message: "website name is required as params" })
        }
        const emailFindQuery = {
            include: [
                {
                    model: Website,
                    where: {
                        name: { [Op.like]: `%${website}%` }
                    },
                    required: true,
                    attributes: ['name']
                }
            ],
        }

        const [{ count: inbox, rows }, { count: unRead }, { count: isArchive }, { count: isJunk }, { count: trashed }, { count: isSent }] = await Promise.all([
            Contact.findAndCountAll({ ...emailFindQuery, where: { isArchive: false, isJunk: false } }),
            Contact.findAndCountAll({ where: { isRead: false }, ...emailFindQuery }),
            Contact.findAndCountAll({ where: { isArchive: true }, ...emailFindQuery }),
            Contact.findAndCountAll({ where: { isJunk: true }, ...emailFindQuery }),
            Contact.findAndCountAll({ where: { deletedAt: { [Op.ne]: null } }, paranoid: false, ...emailFindQuery }),
            Contact.findAndCountAll({
                include: [
                    {
                        model: Website,
                        where: {
                            name: { [Op.like]: `%${website}%` }
                        },
                        required: true,
                        attributes: ['name']
                    },
                    {
                        model: ContactEmailReply,
                        attributes: [], // We don't need to fetch attributes from this table, just check existence
                        required: true, // Change to true to fetch only contacts with replies
                        duplicating: false, // Ensure we don't get duplicate rows due to join
                    }
                ],
            }),
        ])
        return res.json(await successResponseToken({ inbox, unRead, isArchive, isJunk, trashed, isSent }, res))
    } catch (error) {
        await errorRequest(res, error)
    }
}
//get a new Contact
async function listContact({ query }, res) {
    try {
        const website = query?.website
        const isSoftDeleted = query?.isSoftDeleted === "true"
        const isArchive = query?.isArchive === "true"
        const isJunk = query?.isJunk === "true"
        const isSent = query?.isSent === "true"
        if (!website) {
            return res.status(404).json({ message: "website name is required as params" })
        }

        const { limit, page, panginationSchema, rangeSearch } = await pagination(query)
        const globleSearch = await getColumnsKeys(Contact, query?.search)
        const { count, rows: data } = await Contact.findAndCountAll({
            //when isFotDelete is true
            ...((isSoftDeleted) ? { paranoid: false } : {}),
            where: {
                //when isFotDelete is true
                ...(isSoftDeleted ? { deletedAt: { [Op.ne]: null } } : {}),
                ...(isArchive ? { isArchive: true } : { isArchive: false }),
                ...(isJunk ? { isJunk: true } : { isJunk: false }),
                //if it its isArchive
                ...(Object.keys(query).includes("isRead") ? { isRead: query?.isRead } : {}),
                //global search 
                ...(query?.search ? {
                    [Op.or]: [...globleSearch, {
                        "$Website.name$": { [Op.like]: `%${query?.search}%` }
                    }],

                } : {}),
                //range search
                ...rangeSearch
            },
            include: [
                {
                    model: Website,
                    where: {
                        name: website
                    },
                    required: true,
                    attributes: ['name'],
                    include: [{
                        model: ContactEmail,
                        attributes: ['id', "is_active"]
                    }]
                },
                {
                    model: ContactEmailReply,
                    ...(isSent ? {
                        attributes: [], // We don't need to fetch attributes from this table, just check existence
                        required: true, // Change to true to fetch only contacts with replies
                        duplicating: false, // Ensure we don't get duplicate rows due to join
                    } : {}
                    )
                }
            ],
            order: [['createdAt', 'DESC']],
            ...panginationSchema,
        })
        // setTimeout(async () => {
        //     return res.json(await metaData(data, page, count, limit, res));
        // }, 3000)
        return res.json(await metaData(data, page, count, limit, res));
    } catch (error) {
        await errorRequest(res, error)
    }
}

//update a Contact
async function updateContact({ body, params: { id } }, res) {
    try {
        await updateContactValidation.validateAsync(body)
        const contact = await Contact.findOne({ where: { id: Number(id) } })
        if (!contact) return res.status(404).json({ message: "Contact not found" })
        //update
        await Contact.update(body, { where: { id: contact.id } },)
        const data = await Contact.findByPk(contact.id)
        return res.json(await successResponseToken(data, res, "Updated Successfully"))
    } catch (error) {
        await errorRequest(res, error)
    }
}

//single Contact
async function singleContact({ params: { id } }, res) {
    try {
        const data = await Contact.findOne({
            paranoid: false,
            where: { id: Number(id) }, include: [
                {
                    model: Website,
                    required: true,
                    attributes: ['name'],
                    include: [{
                        model: ContactEmail,
                        attributes: ['id', "is_active"]
                    }]
                },
                { model: ContactEmailReply }
            ],
        })
        return res.json(await successResponseToken(data, res))
    } catch (error) {
        await errorRequest(res, error)
    }
}

//delete
async function deleteContact({ params: { id } }, res) {
    try {
        const contact = await Contact.findOne({ where: { id: Number(id) } })
        if (!contact) return res.status(404).json({ message: "Contact not found" })
        await Contact.destroy({ where: { id: contact.id } })
        return res.json(await successResponseToken(contact.id, res, "Deleted Successfully"))
    } catch (error) {
        await errorRequest(res, error)
    }
}
module.exports = { createContact, updateContact, deleteContact, listContact, singleContact, getCountContact }