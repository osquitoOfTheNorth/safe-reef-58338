module.exports = function(app, db) {
  app.post('/user', (req, res) => {
    // You'll create your note here.
    res.send('Hello')
  });
};