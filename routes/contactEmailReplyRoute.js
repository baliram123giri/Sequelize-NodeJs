const { createContactEmailReply, singleContactEmailReply, deleteContactEmailReply } = require("../controllers/ContactReplyController/ContactReplyController")

const router = require("express").Router()

//contactReplies types
router.post("/create", createContactEmailReply)
router.get("/single/:id", singleContactEmailReply)
router.delete("/delete/:id", deleteContactEmailReply)

module.exports = router