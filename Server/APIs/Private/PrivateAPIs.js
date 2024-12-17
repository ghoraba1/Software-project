const DB = require('../../DB/Index.js');
const {get_user}=require('../../Middleware/Sec_functions.js');

function HandlePrivateAPIs(app){
    // const AdminCheck = async (req, res, next) => {
    //     try {
    //       const user = await get_user(req);
    //       //checks if user is admin using the get_user func from middleware.
    //       if (user.role !== "admin") {
    //         return res.status(401).json({ error: "User not admin." });
    //       }
    //       //if admin proceeds, if not code doesn't send.
    //       next();
    //     } catch (error) {
    //       console.error("Error:", error);
    //       return res.status(400).send("Authorization failed.");
    //     }
    //    next();
    //   };

//user APIs----------------------------------------------------
    app.get('/api/v1/users/view',async (req,res)=>{
      user = await get_user(req,res);
      if (!user) {
         return res.status(403).json({ message: 'Unauthorized access' }); // Stops execution after redirection or error
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
             const query=`DELETE from users WHERE user_id=${req.params.id}`
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
    app.post('/api/v1/equipment/new', async (req, res) => {
      user = await get_user(req,res);
      if (!user) {
         return res.status(403).json({ message: 'Unauthorized access' }); // Stops execution after redirection or error
     }
    if(user.role == "admin"){
       try{
        const {equipment_name, equipment_img, rating, model_number, purchase_date, quantity, status, location, 
          category_id, supplier_id} = req.body;
          const eq = {equipment_name, equipment_img, rating, model_number, purchase_date, quantity, status, location, 
            category_id, supplier_id}
       await DB('public.equipment').insert(eq);
       console.log("equpment success")
       res.status(200).send("equipment added!");
       }
        catch(err){
          console.log("Error:", err.message);
       if (!res.headersSent) {
        res.status(400).send("Unable to add equipment.");
      }
       }   
   }
    else{
       return res.status(400).send("You are not an admin")
   }
    });

    app.put('/api/v1/equipment/:id', async (req, res) => {
      user = await get_user(req,res);
      if (!user) {
         return res.status(403).json({ message: 'Unauthorized access' }); // Stops execution after redirection or error
     }
    if(user.role == "admin"){
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
     const result = await DB.raw(query);
     return res.status(200).json("Succesfully updated.");
       }
        catch(err){
          console.log("Error:", err.message);
        return res.status(400).json("Unable to update equipment.");
       }   
   }
    else{
       return res.status(400).send("You are not an admin")
   }
      });

    app.delete('/api/v1/equipment/:id', async (req, res) => {
      user = await get_user(req,res);
      if (!user) {
         return; // Stops execution after redirection or error
     }
    if(user.role == "admin"){
       try{
        const query = `DELETE FROM "equipment" where equipment_id =${req.params.id}`;
        const result = await DB.raw(query);
        //Just in case row is already deleted or non existant, you can delete it if we dont care about special cases like this
        if (result.rowCount === 0) {
          return res.status(404).send("Equipment not found.");
        }
        return res.status(200).send("Deletion successful.");
       }
        catch(err){
          console.log("Error:", err.message);
          return res.status(400).send("Unable to delete equipment.");
     }   
   }
    else{
       return res.status(400).send("You are not an admin")
   }
        
     
    });

//RatingCartOrder APIs----------------------------------------------------
    app.post('/api/v1/rating/new', async (req, res) => {
        try {
          const user = await get_user(req);
          if (!user) {
            return res.status(403).json({ message:'Unauthorized access'});
          }
       
          if (user.role!=='standard_user') {
            return res.status(403).json({ message: 'Only standard users can add ratings' });
          }
       
          const { equipment_id, comment, score} = req.body;
          await DB('rating').insert({
            user_id: user.user_id,
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
        await DB('cart').insert({
          user_id: user.user_id,
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
  
        const result = await DB('cart')
          .where({ cart_id: cartId, user_id: user.user_id })
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
        // Get the authenticated user
        const user = await get_user(req);
    
        if (!user) {
          return res.status(403).json({ message: 'Unauthorized access' });
        }
    
        // Fetch the cart items for the user
        const cartItems = await DB('cart')
          .select('equipment_id', 'quantity')
          .where({ user_id: user.user_id });
    
        if (!cartItems || cartItems.length === 0) {
          return res.status(400).json({ message: 'Cart is empty. Cannot place an order.' });
        }
    
        // Create a new order and return the inserted order's ID
        const [order] = await DB('orders').insert(
          {
            user_id: user.user_id,
            date: DB.fn.now(),
          },
          ['order_id'] // Return the order_id from the inserted row
        );
    
        const orderId = order.order_id;
    
        // Add the cart items to the EquipmentOrder table
        const equipmentOrderEntries = cartItems.map((item) => ({
          order_id: orderId,
          equipment_id: item.equipment_id,
          quantity: item.quantity,
        }));
    
        await DB('equipmentorder').insert(equipmentOrderEntries);
    
        // Clear the user's cart after the order is placed
        await DB('cart').where({ user_id: user.user_id }).del();
    
        // Respond with success and the order ID
        return res.status(201).json({
          message: 'Successfully placed order',
          orderId: orderId,
        });
      } catch (error) {
        // Log the error for debugging
        console.error('Error placing order:', error);
    
        // Respond with a generic error message
        return res.status(500).json({ error: 'Internal server error' });
      }
    });
app.put('/api/v1/cart/update/:cartId', async (req, res) => {
  try {
    const user = await get_user(req);
    if (!user) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    // Extract cart ID and adjustment value
    const { cartId } = req.params;
    const { adjustment } = req.body; // adjustment can be positive (add) or negative (subtract)
    // Validate adjustment input
    if (typeof adjustment !== 'number' || adjustment === 0) {
      return res.status(400).json({ message: 'Invalid adjustment value' });
    }
    // Fetch the current cart item
    const [cartItem] = await DB('cart')
      .select('quantity')
      .where({ cart_id: cartId, user_id: user.user_id });

    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    // Calculate the new quantity
    const newQuantity = cartItem.quantity + adjustment;
    if (newQuantity < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }
    // Update the cart item
    await DB('cart')
      .where({ cart_id: cartId, user_id: user.user_id })
      .update({ quantity: newQuantity });

    return res.status(200).json({
      message: 'Cart updated successfully',
      newQuantity,
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/v1/cart/view', async (req, res) => {
  try {
    // Authenticate the user
    const user = await get_user(req);
    if (!user) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Query the cart for the authenticated user
    const cartItems = await DB('cart')
      .join('equipment', 'cart.equipment_id', '=', 'equipment.equipment_id')
      .select(
        'cart.cart_id',
        'cart.quantity',
        'equipment.equipment_name',
        'equipment.equipment_img',
        'equipment.model_number',
      )
      .where({ 'cart.user_id': user.user_id });

    // If the cart is empty
    if (cartItems.length === 0) {
      return res.status(200).json({ message: 'Cart is empty', cart: [] });
    }

    // Return the cart items
    return res.status(200).json({
      cart: cartItems,
    });
  
  }catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

}

module.exports = {HandlePrivateAPIs};