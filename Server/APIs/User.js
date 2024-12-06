const DB =require('../DB/Index.js')
//User APIs will access the database so we need to include th file 
const {get_user}=require('../Middleware/Sec_functions.js')
//To chech autorization of the user
function UserAPIs(app){

    app.get('/api/v1/users/view',async (req,res)=>{
      user = await get_user(req,res);
      if (!user) {
         return; // Stops execution after redirection or error
     }
if(user.role == "admin"){
       try{
        const result =await DB.raw(`SELECT * FROM users`)
        console.log(`results :`,result.rows)
        return res.status(200).send(result.rows);

       }
     catch(err){
    
        console.log(`error message`, err.message)
        return res.status(400).send("Failed to get all the users") ;
     }   
   }
   else{
      return res.status(400).send("You are not an admin")
   }
    } )

    app.post('/api/v1/users/new',async(req,res)=>{
      
      try{
         const{username,email,password,role,created_at}=req.body ;

         const result =DB.raw(`INSERT INTO users (username,email,password,role,created_at)
            VALUES ('${username}','${email}',crypt('${password}',gen_salt('bf')),'${role}','${created_at}')`)

            return res.status(200).send("New user has been scucessfully added")
   //Do I need to get the created_at from the user ?

      }
      catch(err){
         console.log("error",err.message)
         return res.status(400).send("Failed to add your account")
  
      }

   } )

   app.put('/api/V1/users/:id',async(req,res)=>{
      try{
         const{username,email,password,role}=req.body ;
         const query=`UPDATE users
         set username='${username}',
         email='${email}',
         password=crypt('${password}',gen_salt(bf)),
         role='${role}'
         WHERE id=${req.params.id}`
         
         const result =await DB.raw(query) ;
         return res.status(200).send("Your account is updated") ;

      }
      catch(err){
         console.log("error",err.message)
         return res.status(400).send("Failed to update") ;

      }
      
   
   })
   app.delete('/api/v1/users/:id',async(req,res)=>
   {
      try{
         const query=`DELETE from users WHERE id=${req.params.id}`
         const resuslt = await DB.raw(query) ;
         return res.status(200).send("Deleted successfully")

      }
      catch(err)
      {
         console.log("error",err.message)
         return res.status(400).send("Failed to delete the account")
      }

   })


   }


module.exports= {UserAPIs} ;

// We will export the UserAPIs to be able to use it in the server_mainfile 