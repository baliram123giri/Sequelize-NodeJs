const { sequelize } = require("../../models");
const ContactEmailReply = require("../../models/ContactReplyModel");
const {
    errorRequest,
    pagination,
    getColumnsKeys,
    metaData,
    successResponseToken,
} = require("../../utils/Helper");
const {
    createContactEmailReplyValidation,
} = require("./validation");
const ejs = require("ejs")
const path = require("path");
const { sendEmail } = require("../../utils/sendEmail.utils");
const Contact = require("../../models/ContactModel");
const ContactEmail = require("../../models/ContactEmailModel");
const Website = require("../../models/WebsiteModel");

//create a new ContactEmailReply
async function createContactEmailReply({ body }, res) {
    let transaction;

    try {
        // Begin transaction
        transaction = await sequelize.transaction();

        // Validation
        await createContactEmailReplyValidation.validateAsync(body, { transaction });

        // Find Contact and Contact Email
        const findContact = await Contact.findOne({
            where: { id: Number(body?.contactId) },
            attributes: ["email", "name", "WebsiteId"],
            transaction,
        });
        
        const findContactEmail = await ContactEmail.findOne({
            where: { id: Number(body?.contactEmailId) },
            include: [Website],
            transaction,
        });


        if (!findContact || !findContactEmail) {
            return res.status(404).json({ message: "Contact Not Found" });
        }

        // Create Contact Email Reply within the transaction
        const contactEmailReply = await ContactEmailReply.create(body, { transaction });
        const data = { name: findContact.name, comment: contactEmailReply?.comment, website: findContactEmail?.Website?.name, }
        // Generate email content
        await ejs.renderFile(path.join(__dirname, "../../mails/reply.ejs"), data);

        // Send email with transactional data
        await sendEmail({
            email: findContact.email,
            subject: ` Reply From ${findContactEmail?.Website?.name} `,
            template: "reply.ejs",
            data
        }, {
            email: findContactEmail?.email,
            host: findContactEmail?.smtp_host,
            port: findContactEmail?.smtp_port,
            password: findContactEmail?.smtp_password,
            service: findContactEmail?.smtp_service,
        }, { transaction });

        // Commit transaction on success
        await transaction.commit();

        return res.json(await successResponseToken(contactEmailReply, res));
    } catch (error) {
        console.error(error); // Log the error for debugging

        // Rollback transaction on error
        if (transaction) await transaction.rollback();

        await errorRequest(res, error);
    }
}

//single ContactEmailReply
async function singleContactEmailReply({ params: { id } }, res) {
    try {
        const data = await ContactEmailReply.findOne({ where: { id: Number(id) } });
        return res.json(await successResponseToken(data, res));
    } catch (error) {
        await errorRequest(res, error);
    }
}

//delete
async function deleteContactEmailReply({ params: { id } }, res) {
    try {
        const contactEmailReply = await ContactEmailReply.findOne({ where: { id: Number(id) } });
        if (!contactEmailReply) return res.status(404).json({ message: "ContactEmailReply not found" });
        await ContactEmailReply.destroy({ where: { id: contactEmailReply.id } });
        return res.json(
            await successResponseToken(undefined, res, "Deleted Successfully")
        );
    } catch (error) {
        await errorRequest(res, error);
    }
}
module.exports = {
    createContactEmailReply,
    deleteContactEmailReply,
    singleContactEmailReply,
};
