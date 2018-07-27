const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const cors           = require('cors');
const app            = express();
const port = process.env.PORT || 5000;
var path = require('path');
global.APPROOT = path.resolve(__dirname);
app.use(bodyParser.urlencoded({ extended: true}));
app.use('/public', express.static('public'));
app.use(cors());
MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err)
    require('./app/routes')(app, database);
    app.listen(port, () => {
        console.log('We are live on ' + port);
    })
});