const DB = require('../../DB/Index.js');
const {get_user}=require('../../Middleware/Sec_functions.js');

function HandlePrivateAPIs(app){
    const AdminCheck = async (req, res, next) => {
        try {
          const user = await get_user(req);
          //checks if user is admin using the get_user func from middleware.
          if (user.role !== "admin") {
            return res.status(401).json({ error: "User not admin." });
          }
          //if admin proceeds, if not code doesn't send.
          next();
        } catch (error) {
          console.error("Error:", error);
          return res.status(400).send("Authorization failed.");
        }
       next();
      };

//user APIs----------------------------------------------------
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

//equipment APIs----------------------------------------------------
    app.post('/api/v1/equipment/new', AdminCheck , async (req, res) => {
     try{
       console.log("req",req.body);
       const {equipment_name, equipment_img, rating, model_number, purchase_date, quantity, status, location, 
         category_id, supplier_id} = req.body;
    
       const result = await db.raw(
         `INSERT INTO equipment (equipment_name, equipment_img, rating, model_number, purchase_date, quantity, status,
          location, category_id, supplier_id) 
         VALUES ('${equipment_name}', '${equipment_img}', '${rating}', '${model_number}',
          '${purchase_date}', '${quantity}', '${status}', '${location}', '${category_id}', '${supplier_id}');`);
       
       return res.status(200).send('Equipment successfully added');
     } catch (err) {
       console.log("Error:", err.message);
       return res.status(400).send('Unable to create equipment');
     }
    });

    app.put('/api/v1/equipment/:id', AdminCheck , async (req, res) => {
        try{
          const { equipment_name, equipment_img, rating, model_number,
             purchase_date, quantity, status, location, category_id, supplier_id } = req.body;
          console.log(req.body);
          const query = `UPDATE "equipment"
                          SET
                          equipment_name = '${equipment_name}',
                          equipment_img = '${equipment_img}',
                          rating = ${rating},
                          model_number = ${model_number},
                          purchase_date = '${purchase_date}',
                          quantity = '${quantity}',
                          status = '${status}',
                          location = '${location}',
                          category_id = '${category_id}',
                          supplier_id = '${supplier_id}'
                          WHERE equipment_id = ${req.params.id}`;
        const result = await db.raw(query);
        return res.status(200).send("Succesfully updated.");
        } catch (err) {
        console.log("Error:", err.message);
        return res.status(400).send("Unable to update equipment.");
      };
      });

    app.delete('/api/v1/equipment/:id', AdminCheck , async (req, res) => {
      try {
        const query = `DELETE FROM "equipment" where equipment_id =${req.params.id}`;
        const result = await db.raw(query);
        //Just in case row is already deleted or non existant, you can delete it if we dont care about special cases like this
        if (result.rowCount === 0) {
          return res.status(404).send("Equipment not found.");
        }
        return res.status(200).send("Deletion successful.");
      } catch (err) {
        console.log("Error:", err.message);
        return res.status(400).send("Unable to delete equipment.");
      }
    
    });

//RatingCartOrder APIs----------------------------------------------------
    app.post('/api/v1/rating/new', async (req, res) => {
        try {
          const user = await get_user(req);
          if (!user) {
            return res.status(403).json({ message:'Unauthorized access'});
          }
       
          if (user.role!=='standard user') {
            return res.status(403).json({ message: 'Only standard users can add ratings' });
          }
       
          const { equipment_id, comment, score } = req.body;
          await DB('Rating').insert({
            user_id: user.id,
            equipment_id,
            comment,
            score,
          });
    
          res.status(201).json({ message:'Successfully added rating'});
        } catch (error) {
          console.error('Error adding rating:', error);
          res.status(500).json({ error:'Internal server error'});
        }
      });
    
      app.post('/api/v1/cart/new', async (req, res) => {
        try {
          const user = await get_user(req);
    
          if (!user) {
            return res.status(403).json({ message: 'Unauthorized access' });
          }
    
          const { equipment_id, quantity } = req.body;
          await DB('Cart').insert({
            user_id: user.id,
            equipment_id,
            quantity,
          });
    
          res.status(201).json({ message: 'Successfully added to cart' });
        } catch (error) {
          console.error('Error adding to cart:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      });
      app.delete('/api/v1/cart/delete/:cartId', async (req, res) => {
        try {
          const user = await get_user(req);
    
          if (!user) {
            return res.status(403).json({ message: 'Unauthorized access' });
          }
    
          const { cartId } = req.params;
    
          const result = await DB('Cart')
            .where({ id: cartId, user_id: user.id })
            .del();
    
          if (result === 0) {
            return res.status(404).json({ message: 'Item not found in cart' });
          }
    
          res.status(200).json({ message: 'Successfully deleted item from cart' });
        } catch (error) {
          console.error('Error deleting from cart:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      });
     
      app.post('/api/v1/order/new', async (req, res) => {
         try {
          const user = await get_user(req);
    
          if (!user) {
            return res.status(403).json({ message: 'Unauthorized access' });
          }
    
          // Create a new order
          const [orderId] = await DB('Orders').insert(
            { user_id: user.id, date: DB.fn.now() }, // Line 123: Modified to use `date` instead of `created_at`
            ['id']
          );
    
          const cartItems = await DB('Cart')
            .select('equipment_id', 'quantity')
            .where({ user_id: user.id });
         
          for (const item of cartItems) {
            await DB('EquipmentOrder').insert({
              order_id: orderId,
              equipment_id: item.equipment_id,
              quantity: item.quantity,
            });
          }
         
          await DB('Cart').where({ user_id: user.id }).del();
          res.status(201).json({ message: 'Successfully placed order', orderId });
        } catch (error) {
          console.error('Error placing order:', error);
          res.status(500).json({ error: 'Internal server error' });
        }
      });
}

module.exports = {HandlePrivateAPIs};