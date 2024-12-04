const DB =require('../DB/Index.js')
const get_token = require('./Sec_functions.js')

function Middleware(app)
{
  //////////////////////////////////////////////////////////////////////////////////////////////////////
let result = await db.raw(`select exists ( 
    select * 
    from information_schema.tables 
    where table_schema = 'backendTutorial' 
    and table_name = 'Employee');`);
  let status = result.rows[0].exists;
  if(status == false){
    return res.send("you need to create database table Employee in schema backendTutorial")
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////
  result = await db.raw(`select exists (  
    select * 
    from information_schema.tables 
    where table_schema = 'backendTutorial' 
    and table_name = 'User');`);
  status = result.rows[0].exists;
  if(status == false){
    return res.send("you need to create database table User in schema backendTutorial")
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////
  result = await db.raw(`select exists (    
    select * 
    from information_schema.tables 
    where table_schema = 'backendTutorial' 
    and table_name = 'Session');`);
  status = result.rows[0].exists;
  if(status == false){
    return res.send("you need to create database table Session in schema backendTutorial")
  }

  const sessionToken = getSessionToken(req);

  if (!sessionToken) {
    console.log("sesison token is null")
    return res.status(301).redirect('/');
  }

  const userSession = await db.select('*').from('backendTutorial.Session').where('token', sessionToken).first(); //////////////////////////////////
  if (!userSession) {
    console.log("user session token is not found")

    return res.status(301).redirect('/');
  }
 
  if (new Date() > userSession.expiresAt) {
    console.log("expired session");
    return res.status(301).redirect('/');
  }


  next();


}

module.exports= {Middleware} ;
