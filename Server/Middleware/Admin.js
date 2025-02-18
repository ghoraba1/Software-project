const DB =require('../DB/Index.js')
const {get_session_token} = require('./Sec_functions.js')

 async function Middleware(req,res,next)
{
  ////////////////////////////////////////////////////////////////////////////////////////////////////// equipment
let result = await DB.raw(`select exists ( 
    select * 
    from information_schema.tables 
    where table_schema = 'public' 
    and table_name = 'equipment');`);
  let status = result.rows[0].exists;
  if(status == false){
    return res.send("you need to create database table Equipment")
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////// categories
  result = await DB.raw(`select exists (  
    select * 
    from information_schema.tables 
    where table_schema = 'public' 
    and table_name = 'categories');`);
  status = result.rows[0].exists;
  if(status == false){
    return res.send("you need to create database table Categories")
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////// suppliers
  result = await DB.raw(`select exists (    
    select * 
    from information_schema.tables 
    where table_schema = 'public' 
    and table_name = 'suppliers');`);
  status = result.rows[0].exists;
  if(status == false){
    return res.send("you need to create database table Suppliers")
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////// session
  result = await DB.raw(`select exists (    
    select * 
    from information_schema.tables 
    where table_schema = 'public' 
    and table_name = 'session');`);
  status = result.rows[0].exists;
  if(status == false){
    return res.send("you need to create database table Session")
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////// users
  result = await DB.raw(`select exists (    
    select * 
    from information_schema.tables 
    where table_schema = 'public' 
    and table_name = 'users');`);
  status = result.rows[0].exists;
  if(status == false){
    return res.send("you need to create database table Users")
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////// Orders
  result = await DB.raw(`select exists (    
    select * 
    from information_schema.tables 
    where table_schema = 'public' 
    and table_name = 'orders');`);
  status = result.rows[0].exists;
  if(status == false){
    return res.send("you need to create database table Orders")
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////// Cart
  result = await DB.raw(`select exists (    
    select * 
    from information_schema.tables 
    where table_schema = 'public' 
    and table_name = 'cart');`);
  status = result.rows[0].exists;
  if(status == false){
    return res.send("you need to create database table Cart")
  }
////////////////////////////////////////////////////////////////////////////////////////////////////////// Rating
  result = await DB.raw(`select exists (    
    select * 
    from information_schema.tables 
    where table_schema = 'public' 
    and table_name = 'rating');`);
  status = result.rows[0].exists;
  if(status == false){
    return res.send("you need to create database table Rating")
  }


 
  const sessionToken = await get_session_token(req);
//this checks if the user has got a session id or not, if he doesnt have one, this mean that he hasnt set any cookies on this site yet and therefore he cant be logged in
  if (!sessionToken) {
    console.log("sesison token is null")
    return res.status(301).redirect('/');
  }
//how session works: every user has his own session_id (a random large number of characters), when he logs in, his session_id is inserted into a table called session(or whatever we will call it), it may have another name (session map)
 //when the session of the user expires, the session_id is removed from the table and the user will have to log in again to reinsert it
 //what happens here: this query checks if the session_id is in the session table, if not, then the user is not logged in, so he will be redirected to '/'
  const userSession = await DB.select('*').from('public.session').where('token', sessionToken).first(); //////////////////////////////////
  if (!userSession) {
    console.log("user session token is not found")

    return res.status(301).redirect('/');
  }
 //if the user is logged in, but his session ended while he is using the website, he must be redirected to  page (or the '/')
 //note: we define the session period, we can make it 5min, 4 hours or anything
  if (new Date() > userSession.expiresat) {
    console.log("expired session");
    return res.status(301).redirect('/');
  }

//if we reached this point, this means that
//1- the user already has a cookie that has a session_id
//2- the session_id is found in the session table
//3- the session hasnt expired yet
//therefore the user is permitted to the private apis by the next() which means {go next, you can pass}
  next();


}

module.exports= {Middleware} ;
