const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require("path");
const cors =require("cors");
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const users = require('./routes/userRoutes');

 app.use('/api', users);  




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));