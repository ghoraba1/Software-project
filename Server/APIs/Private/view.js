


function handlePrivateFrontEndView(app){

    app.get('/EquipmentMangementAdmin', async (req, res)=>{
      user = await get_user(req,res);
      if (user.role == admin){
    
      
      return res.render('EquipmentMangementAdmin');

      }
    })
}
module.exports = {handlePrivateFrontEndView}
