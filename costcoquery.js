
let request = require('request');
let cheerio = require('cheerio');

function doRequest(options) {
    return new Promise(function (resolve, reject) {
      request(options, function (error, res, body) {
        if (!error && res.statusCode == 200) {
          resolve(body);
        } else {
          reject(error);
        }
      });
    });
  }
  
  // Usage:
  
  async function main() {

    var options = {
        url : "https://www.costco.com/CatalogSearch?dept=All&keyword=soccer",
        headers : {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
            "accept-language": "en-US,en;q=0.9",
            "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Mobile Safari/537.36"
        }
    }

    let res = await doRequest(options);

    const $ = cheerio.load(res);

    console.log($('.caption .caption .description').first().text().trim());
    console.log($('.thumbnail .product-img-holder img').first().attr('src').trim());

  }
  
  main();