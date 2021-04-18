var express = require('express');
var router = express.Router();
var getOngoingAnime = require('../src/GetOngoingAnime');
var episodeList = require('../src/EpisodeList');
var humanVerification = require('../src/HumanVerification');

router.get('/', async function(req, res, next) {
    let ongoingAnime = await getOngoingAnime.getOngoingAnime();

    res.status(200).json({
        msg: `List Ongoing Anime`,
        list: ongoingAnime
    });
});



router.post('/get-episode/', async function(req, res, next) {
    let episode = await episodeList.getEpisodeList(req.body);

    res.status(200).json({
        msg: `List Episode ${req.body.link}`,
        episode: episode
    });
});

module.exports = router;
