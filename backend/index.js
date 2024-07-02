const express = require("express");
const userRoutes = require("./Routes/userRoutes")
const postRoutes = require("./Routes/postRoutes")
const validateRoutes = require("../backend/Routes/validateRoutes")
const cors = require("cors")
const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");

const db = mongoose.connect("mongodb+srv://saichethan:chethan123@cluster0.4w5525m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

const PORT = 5000;

const server = express();
server.use(express.json());
server.use(cors())
server.use(cookieParser())
server.use('/post',postRoutes)
server.use('/user',userRoutes)
server.use("/val",validateRoutes)
server.listen(PORT,()=>console.log("Server is running on port "+PORT))
