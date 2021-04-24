const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

class HumanVerification {
    
    async getLinkDownload(downloadLink) {
      let pageDownload = await axios.get(downloadLink);
      let $pageDownload = cheerio.load(pageDownload.data);

      try {
        const browser = await puppeteer.launch();
        let form = $pageDownload('div.humancheck').find('form'),
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
        await browser.close();

        return link;
      } catch (error) {
        return 'error';
      }
    }
}

module.exports = new HumanVerification()