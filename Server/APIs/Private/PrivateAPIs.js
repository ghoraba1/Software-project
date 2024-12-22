const DB = require('../../DB/Index.js');
const {get_user}=require('../../Middleware/Sec_functions.js');
const {get_session_token} = require('../../Middleware/Sec_functions.js');
const multer = require('multer');

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
    app.get('/api/v1/user/profile',async (req,res)=>{ ///////////////////////////////////////////////////////
  user = await get_user(req,res);

   try{
    return res.json(user);

   }
    catch(err){

    console.log(`error message`, err.message)
    return res.status(400).send("Failed to get user info") ;
 }   


} )
///////////////////////////////////////////////////////////////////////////////////////////////////// abdo added this api to make the profile
    app.get('/api/v1/user/view',async (req,res)=>{
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
       console.log("equpment success",eq)
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

//Image things
//for file editing and writing
const fs = require('fs');
const db = require('../../DB/Index.js'); //called again idk but it works

// Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); //PLEASE MAKE SURE THIS FOLDER IS THERE WHEN PUSHING, SYSTEM GO BOOM IF NOT
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

//image thingy
app.put('/api/v1/equipment/update-image/:id', upload.single('equipment_img'), async (req, res) => {
  if (!user) {
    return; // Stops execution after redirection or error
}
if(user.role == "admin"){
  try{
    const { id } = req.params;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    console.log('Received ID:', id);
    console.log('Image Path:', imagePath);

    if (!id) {
      return res.status(402).send('Equipment ID is required.');
    }

    //if (!imagePath) {return res.status(400).send('No image file provided.');}

    const updatedRows = await DB('equipment')
      .where('equipment_id', id)
      .update({ equipment_img: imagePath });

    if (updatedRows === 0) {
      return res.status(404).send('Equipment not found.');
    }

    res.status(200).send('Image uploaded and updated successfully.');
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).send('Failed to update image.');
  }
}
else{
 return res.status(400).send("You are not an admin")
}
  
});

//get image

app.get('/get-image', (req, res) => {
  if (!user) {
    return; // Stops execution after redirection or error
}
if(user.role == "admin"){
  try{
  const imagePath = '/uploads/1734692543527-image2s.jpg'; // Replace with your database query result
  res.json({ imagePath });
}
catch(err){
  console.log("Error:", err.message);
  return res.status(402).send("Unable to GET image.");
}   
}
else{
return res.status(400).send("You are not an admin")
}
});

//end of image things

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
       
          const { equipment_id, rating} = req.body;
          await DB('rating').insert({
            user_id: user.user_id,
            equipment_id,
            rating
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
      
          // Check if the equipment already exists in the user's cart
          const existingCartItem = await DB('cart')
            .where({ user_id: user.user_id, equipment_id })
            .first();
      
          if (existingCartItem) {
            // If it exists, update the quantity
            await DB('cart')
              .where({ user_id: user.user_id, equipment_id })
              .update({
                quantity: existingCartItem.quantity + quantity,
              });
          } else {
            // If it doesn't exist, insert a new cart item
            await DB('cart').insert({
              user_id: user.user_id,
              equipment_id,
              quantity,
            });
          }
      
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
        const user = await get_user(req, res);
    
        if (!user) {
          returnres.status(403).json({ message: 'Unauthorized access' }); // get_user function handles the response
        }
    
        // Fetch the cart items for the user
        const cartItems = await DB('cart')
          .select('equipment_id', 'quantity')
          .where({ user_id: user.user_id });
    
        if (!cartItems || cartItems.length === 0) {
          return res.status(400).json({ message: 'Cart is empty. Cannot place an order.' });
        }
    
        // Begin transaction
        await DB.transaction(async (trx) => {
          // Check equipment availability and update quantities
          for (const item of cartItems) {
            // Get the current quantity of the equipment
            const [equipment] = await trx('equipment')
              .select('quantity')
              .where({ equipment_id: item.equipment_id });
    
            if (!equipment) {
              throw new Error(`Equipment with ID ${item.equipment_id} not found`);
            }
    
            if (equipment.quantity < item.quantity) {
              throw new Error(`Insufficient quantity for equipment ID ${item.equipment_id}`);
            }
    
            // Update the equipment quantity
            await trx('equipment')
              .where({ equipment_id: item.equipment_id })
              .update({
                quantity: equipment.quantity - item.quantity,
              });
          }
    
          // Create a new order and get the inserted order's ID
          const [order] = await trx('orders').insert(
            {
              user_id: user.user_id,
              date: DB.fn.now(),
            },
            ['order_id'] // Return the order_id from the inserted row
          );
    
          const orderId = order.order_id;
    
          // Add the cart items to the equipmentorder table
          const equipmentOrderEntries = cartItems.map((item) => ({
            order_id: orderId,
            equipment_id: item.equipment_id,
            quantity: item.quantity,
          }));
    
          await trx('equipmentorder').insert(equipmentOrderEntries);
    
          // Clear the user's cart after the order is placed
          await trx('cart').where({ user_id: user.user_id }).del();
    
          // Commit the transaction
          // Note: No need to manually commit when using `trx` in this way
        });
    
        // Respond with success and the order ID
        return res.status(201).json({
          message: 'Successfully placed order',
        });
      } catch (error) {
        // Log the error for debugging
        console.error('Error placing order:', error.message);
    
        // Respond with an error message
        return res.status(500).json({ error: error.message });
      }
    });
   /* app.post('/api/v1/order/new', async (req, res) => {
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
    });*/
app.put('/api/v1/cart/update/:cartId', async (req, res) => {
  try {
    const user = await get_user(req);
    if (!user) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    // Extract cart ID and adjustment value
    const { cartId } = req.params;
    const { adjustment } = req.body;
    const adjustmentNumber = Number(adjustment);
    
    if (typeof adjustmentNumber != "number" || adjustmentNumber === 0) {
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
    const newQuantity = Number(cartItem.quantity) +Number(adjustment);
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
    const user = await get_user(req, res);
    if (!user) {
      // Return a 401 Unauthorized response
      return res.status(401).json({ success: false, message: 'Unauthorized access' });
    }

    // Query the cart for the authenticated user
    const cartItems = await DB('cart')
      .join('equipment', 'cart.equipment_id', '=', 'equipment.equipment_id')
      .select(
        'cart.cart_id',
        'cart.quantity',
        'equipment.equipment_name',
        'equipment.equipment_img',
        'equipment.model_number'
      )
      .where({ 'cart.user_id': user.user_id });

    // Return the cart items
    return res.status(200).json({
      success: true,
      cart: cartItems,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
app.post('/api/v1/user/logout', async function(req, res) {  
  // Retrieve session token using your existing middleware function  
  const sessionToken = get_session_token(req);  

  // If no session token is found, respond with an error  
  if (!sessionToken) {  
      return res.status(400).json({ message: 'No session token provided' });  
  }  

  try {  
      // Delete the session from the database  
      const result = await DB('public.session').where('token', sessionToken).del();  

      // If no session was found and deleted  
      if (result === 0) {  
          return res.status(400).json({ message: 'No active session found' });  
      }  

      // Since we're handling sessions in the database, we won't clear the cookie  
      return res.status(200).json({ message: 'Successfully logged out' });  
  } catch (error) {  
      console.error(error.message);  
      return res.status(500).json({ message: 'An error occurred while logging out' });  
  }  
});  

// Get all orders with user and equipment details

app.get('/api/v1/orders', async (req, res) => {
  try {
    // Group orders with their respective equipment details
    const orders = await DB('orders')
      .join('users', 'orders.user_id', '=', 'users.user_id')
      .join('equipmentorder', 'orders.order_id', '=', 'equipmentorder.order_id')
      .join('equipment', 'equipmentorder.equipment_id', '=', 'equipment.equipment_id')
      .select(
        'orders.order_id',
        'orders.date',
        'users.username',
        'equipment.equipment_name',
        'equipmentorder.quantity',
        'equipment.equipment_img',
        'equipment.model_number'
      );

    const groupedOrders = orders.reduce((acc, curr) => {
      const { order_id, date, username, equipment_name, quantity, equipment_img, model_number } = curr;

      if (!acc[order_id]) {
        acc[order_id] = {
          order_id,
          date,
          username,
          equipment: []
        };
      }

      acc[order_id].equipment.push({ equipment_name, quantity, equipment_img, model_number });
      return acc;
    }, {});

    res.status(200).json({ orders: Object.values(groupedOrders) });
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});
app.get('/api/v1/orders/:orderId', async (req, res) => {
  try {
      const { orderId } = req.params;
      const orderDetails = await DB('orders')
          .where('orders.order_id', orderId)
          .join('users', 'orders.user_id', '=', 'users.user_id')
          .join('equipmentorder', 'orders.order_id', '=', 'equipmentorder.order_id')
          .join('equipment', 'equipmentorder.equipment_id', '=', 'equipment.equipment_id')
          .select(
              'orders.order_id',
              'orders.date',
              'users.username',
              'equipment.equipment_name',
              'equipmentorder.quantity',
              'equipment.equipment_img',
              'equipment.model_number'
          );

      const formattedOrder = {
          order_id: orderId,
          date: orderDetails[0]?.date,
          username: orderDetails[0]?.username,
          equipment: orderDetails.map(item => ({
              equipment_name: item.equipment_name,
              quantity: item.quantity,
              model_number: item.model_number,
              equipment_img: item.equipment_img,
          })),
      };

      res.status(200).json({ order: formattedOrder });
  } catch (error) {
      console.error('Error fetching order details:', error.message);
      res.status(500).json({ error: 'Failed to fetch order details' });
  }
});


// Start
}

module.exports = {HandlePrivateAPIs};
