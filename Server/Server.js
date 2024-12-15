const express = require("express");
require('dotenv').config();
const app = express();
const cors = require('cors')
app.use(cors())
app.use(express.json())

const {HandlePublicAPIs} = require('./APIs/Public/Public_APIs.js')
const{Middleware} =require('./Middleware/Admin.js');
const {HandlePrivateAPIs} = require("./APIs/Private/PrivateAPIs.js");



HandlePublicAPIs(app);
app.use(Middleware);
HandlePrivateAPIs(app);

app.set('views', './client/public/views');
app.set('view engine', 'hjs');
app.use(express.static('./public'));

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is listening to port ${PORT}`) 
});
