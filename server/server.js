require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/wtd");

const authRoutes = require("./routes/auth");


const app = express();

app.use(express.json());
app.use("/auth", authRoutes);

app.listen(3000, () => {
    console.log("Server running on 3000");
});
