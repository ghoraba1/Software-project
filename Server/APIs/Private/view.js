
const {get_user}=require('../../Middleware/Sec_functions.js');
const DB = require('../../DB/Index.js');


function HandlePrivateFrontEndView(app){

  app.get('/HomeAdmin', async (req, res) => {
    try {
      const user = await get_user(req, res);
      if (user.role === 'admin') {
        return res.render('HomeAdmin');
      } 
      else {
        return res.status(403).send('Access denied');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).send('Internal Server Error');
    }
  });+

  app.get('/HomeUser', async (req, res) => {
    try {
      const user = await get_user(req, res);
      if (user.role === 'standard_user') {
        return res.render('HomeUser');
      } 
      else {
        return res.status(403).send('Access denied');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).send('Internal Server Error');
    }
  });




    app.get('/About2',function(req,res)
{
 return res.render('About(logged)') ;
}) ; 


}
module.exports = {HandlePrivateFrontEndView}
