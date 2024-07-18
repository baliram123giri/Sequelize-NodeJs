const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const UserType = require("./UserTypeModel")
const User = require("./UsersModel")
const Website = require("./WebsiteModel")
const Contact = require("./ContactModel")
const ContactEmail = require("./ContactEmailModel")
const ContactEmailReply = require("./ContactReplyModel")

// Contact.afterCreate(async ({ dataValues }) => {
//     // Broadcast the newly created contact to connected clients
//     console.log(contact, "Contact created")
// });
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        credentials: true
    },
});
// Socket.io
io.on('connection', (socket) => {
    console.log("Socket connection Successfully")
    // Handle inboxes
    socket.on("inboxes", () => { })
    socket.on('disconnect', () => {
        console.log("connection Disconnected")
    });

});
//contact
Contact.afterCreate(async ({ dataValues }) => {
    const website = await Website.findOne({ where: { id: dataValues?.WebsiteId } })
    io.emit('inboxes', { ...dataValues, website })
})

module.exports = { UserType, User, Website, Contact, ContactEmail, ContactEmailReply, io, app, server, express }