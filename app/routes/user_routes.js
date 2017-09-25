module.exports = function(app, db) {

  var user_table = "user_table"


  app.get('/user', (req, res) => {


  });

  app.post('/user', (req,res) => {
  	var newUsr = req.body;
  	db.collection(user_table).insertOne(newUsr,function(err,doc){
  		res.json(doc)
  	})
  });


};
