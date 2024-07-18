const { loginUser } = require("../controllers/userController/userController")

const router = require("express").Router()

//user types
router.post("/login", loginUser)


module.exports = router