const express = require("express");
require('dotenv').config();

const {PublicAPIs} = require('./APIs/Public_APIs.js')
const {EquipmentAPIs} = require('./APIs/Equipment.js')
const {CartAPIs} = require('./APIs/RatingCartOrder.js')
const {UserAPIs} = require('./APIs/User.js')
const{Middleware} =require('./Middleware/Admin.js')

const app = express();
app.use(express.json())

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is listening to port ${PORT}`) 
}) ;

UserAPIs(app);
PublicAPIs(app);
app.use(Middleware);