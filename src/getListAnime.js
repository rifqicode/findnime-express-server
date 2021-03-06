const axios = require('axios');
const cheerio = require('cheerio');

class GetListAnime {
    constructor() {
      this.base = 'https://moenime.web.id/';
    }

    async getOngoingAnime() {
        let result = [];

        try {
          let url = 'https://moenime.web.id/daftar-anime-baru/';
        
          let { data } = await axios.get(url),
              $ = cheerio.load(data);

          $('#daftaranime').find('.nyaalist').each((key, element) => {
            let $element = $(element);
            let data = {
              'name' : $element.text(),
              'link' : `${this.base}` + $element.attr('href'),
            }

            result.push(data);
          });

          return result;
        } catch (error) {
          return result; 
        }
    }
}

module.exports = new GetListAnime()