const express = require("express");
require('dotenv').config();

const {HandlePublicAPIs} = require('./APIs/Public/Public_APIs.js')
const{Middleware} =require('./Middleware/Admin.js');
const {HandlePrivateAPIs} = require("./APIs/Private/PrivateAPIs.js");

const app = express();
app.use(express.json())

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is listening to port ${PORT}`) 
});

HandlePublicAPIs(app);
app.use(Middleware);
HandlePrivateAPIs(app);