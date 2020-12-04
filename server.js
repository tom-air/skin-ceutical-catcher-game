const express = require('express');
// const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(express.static(path.join(__dirname, 'build')));
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 4000);