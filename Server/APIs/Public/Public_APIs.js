const DB = require('../../DB/Index.js')
const bcrypt =require('bcrypt') ; 
const saltRounds =10 ;
//User APIs will access the database so we need to include th file 
const { v4 } = require('uuid');
//we need this to generate UUID (A UUID (Universally Unique Identifier) is a 128-bit number used to uniquely identify objects or entities in computer systems. Here are some key points about UUIDs)
function HandlePublicAPIs(app){


    app.post('/api/v1/user/new',async(req,res)=>{ //register new user 
     //Checking if user exists using email.
      const userExists = await DB.select('*').from('public.users').where('email', req.body.email); 
      if (userExists.length > 0) {
        console.log("UE",userExists)
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
    
    app.put('/api/V1/user/:id',async(req,res)=>{
      try{
         const{username,email,password,role}=req.body ;
         const hashedPassword = await bcrypt.hash(password, saltRounds); 
         const query=`UPDATE users
         SET username='${username}',
         email='${email}',
         password='${hashedPassword}',
         role='${role}'
         WHERE user_id=${req.params.id}`
         
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
          const result = await DB.raw(`
            SELECT 
              e.*, 
              c.category_name, 
              s.supplier_name 
            FROM equipment e
            LEFT JOIN categories c ON e.category_id = c.category_id
            LEFT JOIN suppliers s ON e.supplier_id = s.supplier_id
          `);
          console.log(`Result: `, result.rows);
          return res.status(200).json(result.rows);
        } catch (err) {
          console.log("Error: ", err.message);
          return res.status(400).send(`Unable to view equipment.`);
        }
      });

    app.get('/api/v1/rating/:id', async (req, res)=> {
        try {
          const query = `SELECT * FROM "rating" WHERE rating_id = ${req.params.id}`;
          console.log("req.params id",req.params.id);
          const result = await DB.raw(query);
          return res.status(200).json({ message: "Result:", data: result.rows });
        } catch (err) {
          console.log("Error: ", err.message);
          return res.status(400).send("Unable to view ratings.");
        }
      });


      app.post('/api/v1/user/login', async function(req, res) {
        // get users credentials from the JSON body
        const { email, password } = req.body
        if (!email) {
          // If the email is not present, return an HTTP unauthorized code
          return res.status(400).send('email is required');
        }
        if (!password) {
          // If the password is not present, return an HTTP unauthorized code
          return res.status(400).send('Password is required');
        }
  
        // validate the provided password against the password in the database
        // if invalid, send an unauthorized code
        let user = await DB.select('*').from('public.users').where('email', email);
        console.log("user : : ",user)
        if (user.length == 0) {
          return res.status(400).send('user does not exist');
        }
        user = user[0];
        const hashedPassword = await bcrypt.hash(password, saltRounds);
    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(400).send('Password does not match');
    }
        // set the expiry time as 30 minutes after the current time
        const token = v4();
        const currentDateTime = new Date();
        const expiresAt = new Date(+currentDateTime + 30*60*1000); // expire in 30 minutes
  
        // create a session containing information about the user and expiry time
        const session = {
          user_id: user.user_id,
          token,
          expiresAt,
        };
        try {
          await DB('public.session').insert(session);
          // In the response, set a cookie on the client with the name "session_cookie"
          // and the value as the UUID we generated. We also set the expiration time.
          return res.cookie("session_token", token, { expires: expiresAt }).status(200).send('login successful');
        } catch (e) {
          console.log(session)
          console.log(e.message);
          return res.status(400).send('Could not register user');
        }
      });
  
      
}
        // We will export the UserAPIs to be able to use it in the server_mainfile 
module.exports={HandlePublicAPIs} ;