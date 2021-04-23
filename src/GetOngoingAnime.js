const axios = require('axios');
const cheerio = require('cheerio');
const AnimeOngoing = require('../schema/anime_ongoing/anime_ongoing.dao.js');

class GetOngoingAnime {
    constructor() {
      this.base = 'https://moenime.web.id/';
    }

    async ongoingAnime() {
        let lastUpdate = await AnimeOngoing.findOne().select('createdAt').limit(1);

        let now = new Date();
        let diff = now - (lastUpdate ? lastUpdate.createdAt : 0);
        var diffMins = Math.round(((diff % 86400000) % 3600000) / 60000); // minutes
        
        if (!lastUpdate || diffMins >= 500) {
          await AnimeOngoing.deleteMany({
            delete_flex: 1
          });
          return await this.getOngoingAnime();
        }

        return await AnimeOngoing.find();
    }

    async getOngoingAnime() {
        let result = [];

        try {
          let url = 'https://moenime.web.id/daftar-anime-baru/';
        
          let { data } = await axios.get(url),
              $ = cheerio.load(data);
  
          let list = $('#ongoing').find('.nyaalist');
  
          for (let i = 0; i < list.length; i++) {
            const element = list[i];
            
            let $element = $(element);
            let url = `${this.base}` + $element.attr('href');
  
            let data = {
              'anime_name' : $element.text().trim(),
              'anime_link' : url,
              'anime_image' : 'none',
              'delete_flex' : 1
            }
            
            result.push(data);
          }

          await AnimeOngoing.insertMany(result);
          return result;
        } catch (error) {
          return result; 
        }
    }

    async getImage(url) {
        try {
          let { data } = await axios.get(url),
              $ = cheerio.load(data);

          return  $('#main').find('img.single-featured.wp-post-image').attr('src');
        } catch (error) {
          return '';
        }
    }
}

module.exports = new GetOngoingAnime()