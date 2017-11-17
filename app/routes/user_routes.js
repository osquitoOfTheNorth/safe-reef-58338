module.exports = function(app, db) {


db.createCollection("users",{ validator: { $and:
      [
         { "name": {$type: "string", $exists : true, $ne : "" } },
         { "email":  {$type: "string", $exists : true, $ne : ""} },
         { "password": { $type: "string", $exists : true, $ne : ""}},
         { "paypalinfo" : {$type: "string"} }
      ]
   }
 },function(err,users){
  users.createIndex( { name: "text", email: "text" } );

  app.get('/api/v1/user', (req, res) => {
    let queryParams = req.query;
    let searchString = queryParams["searchString"];
    let query = users.find({$text : {$search : searchString}}).toArray(function(err,data){
      doc = JSON.stringify(data);
      handleMongoCallback(err,doc,res,true);
    });
  });

  app.post('/api/v1/user', (req,res) => {
    
    var user = req.body;
  	users.insertOne(user,(err,doc) => { handleMongoCallback(err,doc,res); });
  });
   /* TODO NEED TO CHECK USER AUTH TYPE BEFORE DELETING ALL RECORDS IN DB */
  app.delete('/api/v1/user', (req,res) => {
    if(req != null && req.query != null && req.query._id == "All"){
      users.remove({},(err,doc) => { handleMongoCallback(err,doc,res); });
    } else if (req.query._id != null && isAlphaNumeric(req.query._id)){
      users.remove({_id: req.query._id},(err,doc) => {
        if(doc.result.n <= 0){
          handleMongoCallback("No such user found",doc,res,false);
        } else {
          handleMongoCallback(err,doc,res);
        }
      });
    } else {
    res.send(getFailureJson("Invalid method parameters"));
    }
  });

  app.post('/api/v1/user/:user_id', (req,res) => {
    if(isAlphaNumeric(req.params.user_id)){
      users.findOneAndUpdate({"_id" : req.params.user_id}, {$set : req.query}, {returnOriginal: false}, (err,doc) =>{
        if(err || doc.lastErrorObject.n <= 0){
          var errMsg = "Could not successfully update user with Id: " + req.params.user_id;
          handleMongoCallback(errMsg, doc, res, false);
        } else {
          handleMongoCallback(err,JSON.stringify(doc.value),res,true);
        }
      });
    } else {
      req.send(getFailureJson("Invalid Request parameters"));
    }

  })

  const handleMongoCallback = (err,doc,res,writedoc) => {
    if(err){
      res.json(getFailureJson(err));
    } else if(writedoc){
      res.json(doc);
    } else {
      res.json(getSuccessJson());
    }
  };

  const getFailureJson = err => {
    if(typeof err != "string"){
      err = err.message + ". Failed with error code: " + err.code;
     }
    return {
      "error_message": err,
      "success": false,
      "status":200
    };
  };

  const getSuccessJson = () => {
    return {"success":true, "status": 200};
  };
  const isAlphaNumeric = ch => {
  	return ch.match(/^[a-z0-9]+$/i) !== null;
  };
});
};
