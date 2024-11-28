const DB =require('../DB/Index.js')

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


}

module.exports= {UserAPIs} ;