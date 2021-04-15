const express = require('express');
const app = express();
const port = 5000;
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');

const scrapping = require('./src/scrapping.js');
const config = require('./config/config.js');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/', async (req, res) => {
    res.json({
      message: 'Hello this is restful api findnime'
    })
});

app.get('/get-list-anime', async (req, res) => {
    let getListAnime = await scrapping.getListAnime();

    res.json({
      status: 200,
      data: getListAnime
    })
});

app.post('/get-episode-anime', async (req, res) => {
    let anime_link = req.body.link;
    let getEpisode = scrapping.getEpisode();

    res.json({
      status: 200,
      data: req.body
    })
});

app.get('/get-ongoing-anime', async (req, res) => {
    // var resultOnGoingAnime = await scrapping.getEpisodeLink();
    var resultOnGoingAnime = await scrapping.getEpisodeDownloadLink();

    res.json({
      status: 200,
      data: resultOnGoingAnime
    })
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


app.listen(port, () => {
  console.log(`App listen in localhost:${port}`);
})
