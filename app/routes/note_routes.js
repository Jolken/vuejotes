var ObjectID = require('mongodb').ObjectID;
var path = require('path');
module.exports = function(app, db) {
  var database = db.db('notes');
    app.get('/', (req, res) => {
        res.sendFile(APP_ROOT+'/public/notes/notes.html');
    });
  app.get('/api/notes/', (req, res) => {
    const collection = database.collection('notes')
    collection.find({}).toArray((err, result) => {
          if (err) {
              res.send({ 'error' : 'An error has occured'});
          }
          else {
            res.json(result);
          }
              
          });
  });
  app.get('/api/notes/:id', (req, res) => {
      const id = req.params.id;
      const details = {'_id': new ObjectID(id)};
      collection.findOne(details, (err, item) => {
        if (err) {
            res.send({ 'error': 'An error has occurred', 'err' : err });
        }
        else {
            res.send(item);
        }
      });
  });
  app.delete('/api/notes/:id', (req, res) => {
      const id = req.params.id;
      const details = {'_id': new ObjectID(id)};
      database.collection('notes').remove(details, (err, item) => {
        if (err) {
            res.send({ 'error': 'An error has occurred', 'err' : err });
        }
        else {
            res.send('Note ' + id + ' deleted');
        }
      });
  });
  app.post('/api/notes', (req, res) => {
    const note = { text: req.body.body, title: req.body.title };
    database.collection('notes').insert(note, (err, result) => {
      if (err) {
        res.send({ 'error': 'An error has occurred', 'err' : err });
      } else {
        res.send(result.ops[0]);
      }
    });
  });
  app.put('/api/notes/:id', (req, res) => {
     const id = req.params.id;
     const details = { '_id': new ObjectID(id) };
     const note = { text: req.body.body, title: req.body.title };
     database.collection('notes').update(details, note, (err, result) => {
        if (err) {
            res.send({ 'error': 'An error has occurred', 'err' : err });
        }
        else {
            res.send(note)
        }
     });
  });
};