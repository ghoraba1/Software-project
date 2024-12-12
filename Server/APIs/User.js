const DB =require('../DB/Index.js')
//User APIs will access the database so we need to include th file 
//const {get_user}=require('../Middleware/Sec_functions.js')
//To chech autorization of the user
function UserAPIs(app){

    app.post('/api/v1/users/new',async(req,res)=>{
      
      try{
         const{username,email,password,role,created_at}=req.body ;

         const result =DB.raw(`INSERT INTO users (username,email,password,role,created_at)
            VALUES ('${username}','${email}',crypt('${password}',gen_salt('bf')),'${role}','${created_at}')`)

            return res.status(200).send("New user has been scucessfully added")


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