const express = require("express");
require('dotenv').config();
const app = express();
const cors = require('cors')
app.use(cors())
app.use(express.json())

const {HandlePublicAPIs} = require('./APIs/Public/Public_APIs.js')
const {HandlePrivateFrontEndView} = require('./APIs/Private/view.js')
const{Middleware} =require('./Middleware/Admin.js');
const {HandlePrivateAPIs} = require("./APIs/Private/PrivateAPIs.js");
const {HandlePublicFrontEndView} = require("./APIs/Public/View.js")

app.set('views', '../Client/public/Views');
app.set('view engine', 'hjs');
app.use(express.static('./public'));

//image upload
app.use('/uploads', express.static('uploads'));

HandlePublicFrontEndView(app);
HandlePublicAPIs(app);
app.use(Middleware);
HandlePrivateAPIs(app);
HandlePrivateFrontEndView(app) ;


const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server is listening to port ${PORT}`) 
});
