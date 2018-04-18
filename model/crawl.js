var superagent = require("superagent");   
var fs = require("fs");
var cheerio = require("cheerio");

var url = 'http://interface.sina.cn/wap_api/layout_col.d.json?&showcid=56261&show_num=100&page=';
var count = 0;
var data = [];
var newsList = [];

getTitles();

function getTitles() {
    const totalCount = 10;
    for (var page = 1; page <= totalCount; page++) {
        superagent.get(url+page)
            .end(function(err, result){
                if(err) console.log(err);
                
                // 取出标题和url
                var list = JSON.parse(result.text).result.data.list.map(e => ({'title': e.title, 'url': e.URL}));
                data = data.concat(list);
                count++;
                // 如果取够了
                if (count === totalCount) {
                    getBody();
                }
            });
    }
}
    
function getBody() {
    var newsCount = data.length;
    var currentCount = 0;
    for (var news of data) {
        ( news => {
        superagent.get(news.url)
            .timeout({
                response: 10000,  // Wait 5 seconds for the server to start sending,
                deadline: 60000, // but allow 1 minute for the file to finish loading.
            })        
            .end(function(err, result) {
                currentCount += 1;
                if(err || typeof(result) === "undefined") {
                    console.log(err);
                    if (currentCount === newsCount) {
                        writeFile(newsList);
                    }    
                    return;
                } 
                //console.log(result.text);
                var $ = cheerio.load(result.text);
                let text = $('.art_pic_card.art_content').text() || "";
                if (text != "") {
                    newsList.push({title: news.title, content: text, url: news.url});
                    console.log(`[${newsList.length}]${news.title}`);
                }
                if (currentCount === newsCount) {
                    writeFile(newsList);
                }
            });
        })(news);
    }
}

// 写入文件
function writeFile(json) {
    var filename = (new Date().format('yyyy-MM-dd hh:mm')+'.txt');
    fs.writeFile('./' + filename, JSON.stringify(json), function(err) {
        if(err) throw err;
        console.log('已存在，内容被覆盖！');
    });    
}

// 日期格式化
Date.prototype.format = function (fmt) {
      var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ?
            (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
      return fmt;
}