module.exports = function(app, db) {
  app.get('/user', (req, res) => {
    // You'll create your note here.
    res.send('Hello')
  });
};