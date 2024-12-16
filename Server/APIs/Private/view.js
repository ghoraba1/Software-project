function handlePrivateFrontEndView(app){
    // app.get('/', function(req, res) {
    // return res.render('index' , 
    //   {title : "Tutorial 9" , 
    //   desc : "Tutorial is mainly about UI connection with server.",
    //   });
    // });

    app.get('/EquipmentMangement', function(req, res){
      return res.render('EquipmentMangement');
    })
}
module.exports = {handlePrivateFrontEndView}