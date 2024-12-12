const DB = require('../../DB/Index.js')
//User APIs will access the database so we need to include th file 

function HandlePublicAPIs(app){
    app.get('/', function(req, res) {
        return res.status(200).send('login page');
        });
        
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
    
     })
    
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
        
    app.get('/api/v1/equipment/view', async (req, res) => {
        // added SQL join
        try {
          const result = await db.raw(`
            SELECT 
              e.*, 
              c.category_name, 
              s.supplier_name 
            FROM equipment e
            LEFT JOIN categories c ON e.category_id = c.category_id
            LEFT JOIN suppliers s ON e.supplier_id = s.supplier_id
          `);
          console.log(`Result: `, result.rows);
          return res.status(200).send(result.rows);
        } catch (err) {
          console.log("Error: ", err.message);
          return res.status(400).send(`Unable to view equipment.`);
        }
      });

    app.get('/api/vi/rating/:id', async (req, res)=> {
        try {
          const query = `SELECT * FROM "rating" WHERE rating_ID = ${req.params.id}`;
          console.log("req.params id",req.params.id);
          const result = await db.raw(query);
          return res.status(200).send("Result: ",result.rows);
        } catch (err) {
          console.log("Error: ", err.message);
          return res.status(400).send("Unable to view ratings.");
        }
      });
}
        // We will export the UserAPIs to be able to use it in the server_mainfile 
module.exports={HandlePublicAPIs} ;