const axios = require('axios');
const cheerio = require('cheerio');

class Scrapping {

  async getAnimeLink() {
    try {
      const url = 'https://moenime.web.id/tag/ongoing/';
      const page = 1;

      var result = [];
      for (var i = 1; i <= page; i++) {
        var page_url = (i == 1) ? url : `${url}/page/${i}`;
        var { data } = await axios.get(page_url),
            $ = cheerio.load(data);

        $('article').find('div.featured-thumb').each((i, element) => {
          var a = $(element).find('a'),
              title = $(element).find('div.out-thumb').text(),
              img = a.find('img');

          result.push({
            img: img.data('src'),
            title: title,
            link: a.attr('href')
          })
        });
      }
      return result;
    } catch (e) {
      return [];
    }
  }

  async getEpisode() {
    try {
      const animeLink = await this.getAnimeLink();
      let result = []
      for (const item of animeLink.slice(0, 1)) {
        result.push(await this.getEpisodeList(item));
      }

      return result;
    } catch (e) {
      return []
    }
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
             listDownloadLink: episodeListLink
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
      return {}
    }
  }
}


module.exports = new Scrapping()
