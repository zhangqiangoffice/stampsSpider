const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')


const download = (url, handleBody) => {
    console.log('下载：', url)
    request(url, function (error, response, body) {
        if (error) {
            console.log('error:', error); // Print the error if one occurred
        } else {
            if (response && response.statusCode === 200) {
                if(handleBody) {
                    handleBody(body)
                } else {
                    console.log('unhandle body:', body)
                }
            } else {
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            }
        }
    });
}

const writeFile = (path, data) => {
    fs.writeFile(path, data, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("保存：" + path);
        }
    });
}

const handleBody = body => {
    $ = cheerio.load(body);
    const list = [];
    
    //生成 邮票套 对象数组
    $('.stamp_shop_list').children().each((i, el) => {
        const stampSet = {}
        const $el = $(el);

        stampSet.detailUrl = $el.find('.stamp_imgs').attr('href');
        stampSet.imgSrc = $el.find('.stamp_imgs img').attr('src');
        stampSet.title = $el.find('.stamp_shop_name').text();
        stampSet.recordNum = $el.find('.stamp_num').text().slice(4);
        
        const averagePriceStr = $el.find('.stamp_average_price_shop').text();
        stampSet.averagePrice = averagePriceStr.substring(7, averagePriceStr.length - 2);
        
        list.push(stampSet)
    })

    //个别瑕疵处理
    list.forEach(obj => {
        
        //标题中左括号使用英文了
        if (obj.title.includes('(')) {
            console.log(`修复：英文左括号 - ${obj.title}`);
            obj.title = obj.title.replace(/\(/g, '（')
        }
        
        //标题中右括号使用英文了
        if (obj.title.includes(')')) {
            console.log(`修复：英文右括号 - ${obj.title}`);
            obj.title = obj.title.replace(/\)/g, '）')
        }

    })
    
    //保存成本地 json 文件
    var outputFilename = './data/sets.json';
    writeFile(outputFilename, JSON.stringify(list, null, 4));
}

const saveHtml = body => {
    $ = cheerio.load(body, { decodeEntities: false });
    
    //保存成本地 html 文件
    var outputFilename = './data/index.html';
    writeFile(outputFilename, $.html());

    const links = [];
    $('a').each((i, el) => {
        const link = {}
        const $el = $(el);
        link.label = $el.text();
        link.url = $el.attr('href');
        links.push(link);
    })

    //保存成本地 json 文件
    var linksFilename = './data/links.json';
    writeFile(linksFilename, JSON.stringify(links, null, 4));
}

const url = 'http://www.chinau.cc/search/searchList.html?orderByIncrease=&orderByReleaseDate=ASC&pageSize=900&currentPage=1&stampCategoryId=512'

const baseUrl = 'http://www.chinesestamp.cn/'

// download(url, handleBody);
// download(baseUrl, saveHtml)

const yearUrl = "http://www.chinesestamp.cn/y1992"

const handleYearBody = body => {
    $ = cheerio.load(body, { decodeEntities: false });
    const sets = [];
    $('.post_content tr').each((i, el) => {
        const stampSet = {};
        const $el = $(el);
        stampSet.detailUrl = $el.find('a').attr('href');
        stampSet.title = $el.find('a').text().trim();
        stampSet.recordNum = $el.find('td:first-child').text().trim();

        sets.push(stampSet);
    })
    console.log('========', sets);
    //保存成本地 json 文件
    var yearFilename = './data/y1992.json';
    writeFile(yearFilename, JSON.stringify(sets, null, 4));
}

download(yearUrl, handleYearBody)


