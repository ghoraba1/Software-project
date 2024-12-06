const DB = require('../DB/Index.js'); 
const { get_user } = require('../Middleware/Sec_functions.js');

function CartAPIs(app) {
 
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

module.exports = { CartAPIs };
