module.exports = function(app, db) {

  var user_table = "user_table"
   db.collection(user_table).createIndex( { name: "text", email: "text" } )
  app.get('/api/v1/user', (req, res) => {
    let queryParams = req.query;
    let searchString = queryParams["searchString"];
    let query = db.collection(user_table).find({$text : {$search : searchString}}).toArray(function(err,data){
      if(err){
        res.write(err);
        res.send()
      } else {
        res.json(JSON.stringify(data));
      }
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

   /* TODO NEED TO CHECK USER AUTH TYPE BEFORE DELETING ALL RECORDS IN DB */
  app.delete('/api/v1/user', (req,res) => {
    if(Object.keys(req.query).length == 0){
      db.collection(user_table).remove({},function(err,doc){
        if(err){
          res.write(err);
        }
        res.send();
      });
    }
  });


};
