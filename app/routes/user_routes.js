module.exports = function(app, db) {
  app.get('/user', (req, res) => {
    // You'll create your note here.
    res.send('Hello');
  });

  app.get('/board', (req,res) => {
  	res.send("Board");
  });

  
};

