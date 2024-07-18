const { createUserType, listUserType, singleUserType, updateUserType, deleteUserType, } = require("../controllers/userTypeController/userTypeController")

const router = require("express").Router()

//user types
router.post("/create", createUserType)
router.get("/list", listUserType)
router.get("/single/:id", singleUserType)
router.put("/update/:id", updateUserType)
router.delete("/delete/:id", deleteUserType)

module.exports = router