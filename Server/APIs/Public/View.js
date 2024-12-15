

function handlePublicFrontEndView(app)
{
app.get('/', function(req, res) {
    return res.render('login page');
    });

 app.get('/register', function(req, res) {
        return res.render('register');
      });

app.get('/EquipmentMangment',function(req,res)
{
 return res.render('register') ;
}) ;    

}
module.exports = {handlePublicFrontEndView}     