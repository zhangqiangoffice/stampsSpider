const request = require('request')
const cheerio = require('cheerio')


const download = url => {
    console.log('下载：', url)
    request(url, function (error, response, body) {
        if (error) {
            console.log('error:', error); // Print the error if one occurred
        } else {
            if (response && response.statusCode === 200) {
                $ = cheerio.load(body);
                const target = $('.stamp_shop_list').text();
                console.log('target: ', target);  
            } else {
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            }
        }
    });
}

const url = 'http://www.chinau.cc/search/searchList.html?orderByIncrease=&orderByReleaseDate=ASC&pageSize=900&currentPage=1&stampCategoryId=512'

download(url);
