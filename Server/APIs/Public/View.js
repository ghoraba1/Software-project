

function handlePublicFrontEndView(app)
{
  app.get('/', function(req, res) {
    return res.render('login');
    });

 app.get('/register', function(req, res) {
        return res.render('register');
      });

app.get('/EquipmentMangement',function(req,res)
{
 return res.render('EquipmentMangement') ;
}) ;    

}
module.exports = {handlePublicFrontEndView}