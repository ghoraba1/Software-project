const express = require("express");
require('dotenv').config();
const app = express();
app.use(express.json())

const {HandlePublicAPIs} = require('./APIs/Public/Public_APIs.js')
const{Middleware} =require('./Middleware/Admin.js');
const {HandlePrivateAPIs} = require("./APIs/Private/PrivateAPIs.js");
const {handlePublicFrontEndView} = require("./APIs/Public/View.js")

app.set('views', './views');
app.use(express.static('./public'));

handlePublicFrontEndView(app);
HandlePublicAPIs(app);
app.use(Middleware);
HandlePrivateAPIs(app);

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is listening to port ${PORT}`) 
});
