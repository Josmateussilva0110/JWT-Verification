const express = require("express")
const cors = require("cors")
const router = require("./routes/routes")

const app = express()

app.use(express.json())
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))
app.use(express.static('public'))

app.use("/",router)

app.listen(8080)
