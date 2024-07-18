const { authorization } = require("../utils/auth")

const router = require("express").Router()

//Authorization
router.use("/auth", require("./authRoute"))

//user types
router.use("/usertype", require("./userTypeRoute"))

//user
router.use("/user", require("./userRoute"))

//website
router.use("/website", authorization("super admin", "admin"), require("./websiteRoute"))

//contact
router.use("/contact", require("./contactRoute"))

//contact reply
router.use("/contact-reply", require("./contactEmailReplyRoute"))

//contact email
router.use("/contact-email", authorization("super admin", "admin"), require("./contactEmailRoute"))

module.exports = router