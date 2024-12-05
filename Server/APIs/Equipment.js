const DB =require('../DB/Index.js')

function EquipmentAPIs(app) {
  

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


///// TASK i ---Authorization needed.
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

 ///// TASK ii ---No authorization needed.
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

///// TASK iii ---Authorization needed.
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

///// TASK iv ---Authorization needed.
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

/////TASK v ---No authorization needed.
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
module.exports = {EquipmentAPIs};
//console.log("test");
