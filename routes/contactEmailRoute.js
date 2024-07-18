const { createContactEmail, listContactEmail, singleContactEmail, updateContactEmail, deleteContactEmail } = require("../controllers/ContactEmailsController/ContactEmailsController")




const router = require("express").Router()

//user types
router.post("/create", createContactEmail)
router.get("/list", listContactEmail)
router.get("/single/:id", singleContactEmail)

router.put("/update/:id", updateContactEmail)
router.delete("/delete/:id", deleteContactEmail)

module.exports = router