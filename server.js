const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const db             = require('./config/db');
const cors           = require('cors');
const app            = express();
const port = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors());
MongoClient.connect(db.url, (err, database) => {
    
    if (err) return console.log(err)
    app.get('/', (req, res) => {
        res.sendFile('index.html', { root: __dirname });
    });
    require('./app/routes')(app, database);
    app.listen(port, () => {
        console.log('We are live on ' + port);
    })
});