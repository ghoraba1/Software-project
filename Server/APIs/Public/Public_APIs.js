const DB = require('../../DB/Index.js')
const bcrypt =require('bcrypt') ; 
const saltRounds =10 ;
//User APIs will access the database so we need to include th file 

function HandlePublicAPIs(app){


    app.post('/api/v1/users/new',async(req,res)=>{

      const userExists = await DB.select('*').from('public.users').where('email', req.body.email);
      console.log("UE",userExists)
      if (userExists.length > 0) {
        return res.status(400).send('user exists');
      }

      try{
        const newUser = req.body;
        const hashedPassword = await bcrypt.hash(newUser.password, saltRounds); //inserting the password as hashed values
        newUser.password = hashedPassword;

        newUser.created_at = new Date(); // seting created at to the real time the user at which the user creates his account

        const user = await DB('public.users').insert(newUser).returning('*');
        console.log("user new",user);
        return res.status(200).json(user);
      } catch (e) {
        console.log(e.message);
        return res.status(400).send('Could not register user'); 
    
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