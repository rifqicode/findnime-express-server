const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

let AnimeEpisode = require('../schema/anime_episode/anime_episode.dao.js');
let HumanVerification = require('../src/HumanVerification');

class EpisodeList {

  constructor() {
    this.base_site = 'https://moenime.web.id/';
  }

  async getEpisodeList(item) {
    try {
      const downloadQuality = '480p';
      const { data } = await axios.get(item.link),
            $ = cheerio.load(data);
      
      var tableContent = $('div.entry-content').find('table.table.table-hover').slice(2),
          totalEpisode = tableContent.length / 2,
          result = {
            title: item.title,
            totalEpisode: totalEpisode,
            dataEpisode: []
          },
          keyEpisode = 1;
  
      for (var i = 0; i < totalEpisode; i++) {
        let title = `Episode ${i + 1}`,
            listEpisode = $(tableContent[keyEpisode]).find('tbody tr'),
            dataEpisode = [],
            current = 0,
            next = 1;
  
        for (var j = 0; j < listEpisode.length / 2 ; j++) {
           let episodeTitle = $(listEpisode[current]).text(),
               episodeListLink = '';
  
            if (!episodeTitle.includes(downloadQuality)) {
              current += 2;
              next += 2;
              continue;   
            };
  
            $(listEpisode[next]).find('td > center > a').map((key, element) => {
              var element = $(element);
              
              if( element.text().toUpperCase() !== 'ZIPPYSHARE') return false;
              episodeListLink = element.attr('href');
            });
  
           dataEpisode.push({
             linkTitle: episodeTitle,
            //  downloadLink: episodeListLink.match('[^=]*$')[0]
             downloadLink: await HumanVerification.getLinkDownload(episodeListLink)
           })
  
           current+= 2;
           next+= 2;
        }
  
        result.dataEpisode.push({
          title: title,
          data : dataEpisode
        });
  
        keyEpisode += 2;
      }
  
      return result;
    } catch (e) {
      return []
    }
  }
}


module.exports = new EpisodeList()
