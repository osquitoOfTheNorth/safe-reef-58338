module.exports = function(app, db) {

  var user_table = "user_table"

  app.get('/api/v1/user', (req, res) => {
    let query = db.collection(user_table).find({name : { $eq : "Tom Tester"}}).toArray(function(err,data){
      if(err){
        res.write(err);
      } else {
        res.write(JSON.stringify(data));
      }
      res();
    });
  });

  app.post('/api/v1/user', (req,res) => {
    var user = req.query.user;
  	db.collection(user_table).insertOne(user,function(err,doc){
      if(!err){
  		  res.json({"success":true, "status": 200});
      }
  	})
  });


};
