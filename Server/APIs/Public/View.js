

function HandlePublicFrontEndView(app)
{
  app.get('/', function(req, res) {
    return res.render('Home');
    });
  app.get('/Home', function(req, res) {
      return res.render('Home');
      });
  

  app.get('/login', function(req, res) {
      return res.render('login');
      });

 app.get('/register', function(req, res) {
        return res.render('register');
      });

app.get('/EquipmentMangement',function(req,res)
{

 return res.render('EquipmentMangement') ;
}) ;    
app.get('/addEquipment',function(req,res)
{
 return res.render('addEquipment') ;
}) ;      
  app.get('/Profile',function(req,res)
{
 return res.render('Profile') ;
}) ;   
}
module.exports = {HandlePublicFrontEndView}
