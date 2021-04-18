const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

class HumanVerification {
    
    async getLinkDownload(downloadLink) {
        const browser = await puppeteer.launch({ headless: false });
        let result = [];
  
        let getDownloadLink = await axios.get(downloadLink);
        let $ = cheerio.load(getDownloadLink.data);
        
        // let form = $('div.humancheck').find('form'),
        //     formAction = form.attr('action'),
        //     token = form.find('input[name=get]').val();

        // console.log({
        //   form, formAction, token
        // });
        // const page = await browser.newPage();
        // await page.setRequestInterception(true);
        // page.on('request', interceptedRequest => {
        //   var data = {
        //     method: 'POST',
        //     postData: `get=${token}`,
        //     headers: {
        //       ...interceptedRequest.headers(),
        //       'Content-Type': 'application/x-www-form-urlencoded'
        //     }
        //   };
        //   interceptedRequest.continue(data);
        // });
        // const response = await page.goto(formAction);
        // const responseBody = await response.text();
        
        // let link = responseBody.match(/[^"{=']+\.html/g)
        // result.push({
        //   name : item.title,
        //   link : link.length > 0 ? link[0] : ''
        // });
        await browser.close();
  
        return result;
    }
}

module.exports = new HumanVerification()