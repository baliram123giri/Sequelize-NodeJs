const { createContact, listContact, singleContact, updateContact, deleteContact, getCountContact } = require("../controllers/contactController/contactController")

const router = require("express").Router()
//Contact
router.post("/create/:websitename", createContact)
router.get("/list", listContact)
//get count of contacts
router.get("/counts", getCountContact)
router.get("/single/:id", singleContact)
router.put("/update/:id", updateContact)
router.delete("/delete/:id", deleteContact)

module.exports = router