require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
mongoose.connect(process.env.MONGO_URI);
const authRoutes = require("./routes/auth");
const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use("/auth", authRoutes);
app.listen(3000, () => {
    console.log("Server running on 3000");
});
