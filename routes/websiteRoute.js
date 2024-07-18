const { createWebsite, listWebsite, singleWebsite, updateWebsite, deleteWebsite, usersWebsite } = require("../controllers/websiteController/websiteController")



const router = require("express").Router()

//user types
router.post("/create", createWebsite)
router.get("/list", listWebsite)
router.get("/single/:id", singleWebsite)
//user base website
router.get("/users/list", usersWebsite)
router.put("/update/:id", updateWebsite)
router.delete("/delete/:id", deleteWebsite)

module.exports = router