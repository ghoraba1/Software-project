


function handlePrivateFrontEndView(app){

    app.get('/EquipmentMangementAdmin', async (req, res)=>{
      user = await get_user(req,res);
      if (user.role == admin){
    
      
      return res.render('EquipmentMangementAdmin');

      }
    })
    app.get('/About2',function(req,res)
{
 return res.render('About(logged)') ;
}) ;   
}
module.exports = {handlePrivateFrontEndView}
