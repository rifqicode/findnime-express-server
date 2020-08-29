const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

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

  async getEpisodeLink() {
    try {
      const animeLink = await this.getAnimeLink();
      let result = []
      for (const item of animeLink) {
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
             downloadLink: episodeListLink
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

  async getEpisodeDownloadLink() {
      const episodeListLink = await this.getEpisodeLink();
      let data = [];

      for (const item of episodeListLink) {
        let dataDownload = await this.bypassHumanVerification(item.dataEpisode);
        
        data.push({
          name : item.title,
          data : dataDownload
        });
      }

      return data;
  }

  async bypassHumanVerification(dataDownloadLink) {
      const browser = await puppeteer.launch();
      let result = [];

      for (const item of dataDownloadLink) {
        const downloadLink = item.data[0].downloadLink;
        const downloadName = item.data[0].linkTitle;
        const getDownloadLink = await axios.get(downloadLink);
        const $ = cheerio.load(getDownloadLink.data);
  
        let form = $('div.humancheck').find('form'),
            formAction = form.attr('action'),
            token = form.find('input[name=get]').val();

        const page = await browser.newPage();
        await page.setRequestInterception(true);
        page.on('request', interceptedRequest => {
          var data = {
            method: 'POST',
            postData: `get=${token}`,
            headers: {
              ...interceptedRequest.headers(),
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          };
          interceptedRequest.continue(data);
        });
        const response = await page.goto(formAction);
        const responseBody = await response.text();
        
        let link = responseBody.match(/[^"{=']+\.html/g)
        result.push({
          name : downloadName,
          link : link
        });
      }
      await browser.close();

      return result;
  }
}


module.exports = new Scrapping()
