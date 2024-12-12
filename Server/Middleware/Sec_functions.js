const DB= require('../DB/Index.js')

function get_session_token(req){
  //check first if the user has a cookie
  if(!req.headers.cookie){
    return null
  }
  //refers to the cookie, splits it into an array, map allows it to pass by each element of the array, trim() removes unnecessary spaces like " hello world " >> "hello world"
  //after trimming, we pass by each element of the array using filter() to isolate the specific part of the cookie that has the session token, we check its presence using includes()
  //after filtering the array and getting the element that has the session token, we use join('') to compress the element like "hello world" >> "helloworld"
  const cookies = req.headers.cookie.split(';')
    .map(function (cookie) { return cookie.trim() })
    .filter(function (cookie) { return cookie.includes('session_token') })
    .join('');
//in order to extract the session token from the element that we got, we use slice(), slice() returns a specified part of an array without modifying the original array
  const sessionToken = cookies.slice('session_token='.length);
//check if there is a session token in the cookie  
  if (!sessionToken) {
    return null;
  }
  return sessionToken;

}


async function  get_user(req,res){
//check if the user has a session token otherwise, redirect back to '/'
    const sessionToken = get_session_token(req);
  if (!sessionToken) {
    console.log("no session token is found")
    res.status(301).redirect('/');
    return null;
  }

  //query the db to search for the user that has this session token
  //note : put the name of the schema instead of (schema_name)//
  const user = await DB.select('*')
    .from({ s: 'public.session' })
    .where('token', sessionToken)
    .innerJoin('public.users as u', 's.user_id', 'u.user_id')
    .first(); 

  
  console.log('user =>', user)
  return user;  

}
module.exports = {get_session_token , get_user};
