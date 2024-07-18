

const cors = require('cors');
require("dotenv").config()
require("./models/index")
const { app, server, io ,express} = require("./models/tables")

//create a port number
const PORT = process.env.PORT || 8000

app.use(express.json())
app.use(cors())

app.use("/api", require("./routes/index"))

app.use("", (req, res) => {
    return res.status(404).json({ message: "Url not found" })
})
//create a server
server.listen(PORT, () => console.log(`server is running at ${PORT}`))

module.exports = { sockeIo: io }