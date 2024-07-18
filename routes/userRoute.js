const { createUser, listUser, singleUser, updateUser, deleteUser } = require("../controllers/userController/userController")
const { authorization } = require("../utils/auth")

const router = require("express").Router()

//user types
router.post("/create", createUser)
router.get("/list", authorization("super admin", "admin"), listUser)
router.get("/single/:id", singleUser)
router.put("/update/:id", updateUser)
router.delete("/delete/:id", deleteUser)

module.exports = router