
function PublicAPIs(app){
    app.get('/', function(req, res) {
        return res.status(200).send('login page');
        });
}

module.exports={PublicAPIs} ;