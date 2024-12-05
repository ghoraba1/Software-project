const DB =require('../DB/Index.js')
//User APIs will access the database so we need to include th file 

function UserAPIs(app){

    app.get('/api/v1/users/view',async (req,res)=>{
       try{
        const result =await DB.raw(`SELECT * FROM users`)
        console.log(`results :`,result.rows)
        return res.status(200).send(result.rows) ;

       }
     catch(err){
    
        console.log(`error message`, err.message)
        return res.status(400).send(err.message) ;
     }   
    } )

    app.post('/api/v1/users/new',async(req,res)=>{
      
      try{
         const{username,email,password,role,created_at}=req.body ;
   //Do I need to get the created_at from the user ?

      }
      catch(err){
  
      }

   } )

}

module.exports= {UserAPIs} ;

// We will export the UserAPIs to be able to use it in the server_mainfile 