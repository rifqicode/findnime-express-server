const express = require('express');
const app = express();
const port = 5000;

const scrapping = require('./src/scrapping.js');


app.get('/', async (req, res) => {
    res.json({
      message: 'Hello this is restful api findnime'
    })
});

app.get('/get-ongoing-anime', async (req, res) => {
    var resultOnGoingAnime = await scrapping.getEpisode();

    res.json({
      status: 200,
      data: resultOnGoingAnime
    })
});


app.listen(port, () => {
  console.log(`App listen in localhost:${port}`);
})
