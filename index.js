const express = require('express');
const app = express();
const port = 5000;
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const config = require('./config/config.js');

const landing = require('./routes/Landing');
const ongoingAnime = require('./routes/OngoingAnime');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', landing);
app.use('/ongoing-anime', ongoingAnime);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


app.listen(port, () => {
  console.log(`App listen in localhost:${port}`);
})
