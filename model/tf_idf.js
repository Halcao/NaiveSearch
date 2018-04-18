var jieba = require("nodejieba");
var fs = require("fs");

function calcTFIDF(list) {
    var idfs = {};
    for (var item of list) {
        // 切词
        var words = jieba.cut(item);
        item.words = words;
        var maxCount = 0;
        // 统计所有词出现次数/最多的词出现次数
        var tfs = words.reduce(function(allElements, word) {
            allElements[word] = typeof(allElements[word]) === 'undefined' ? 1 : allElements[word] + 1;
            // 如果大于最大的个数
            if (allElements[word] > maxCount) {
                maxCount = allElements[word];
            }
            return allElements;
        }, {});
        item.tfs = Object.keys(tfs).map(key => tfs[key]/maxCount);
        // 统计包含某词的文档数
        for (var word of new Set(words)) {
            idfs[word] = typeof (idfs[word]) === "undefined" ? 1 : idfs[word] + 1;
        }
    }

    // 计算idf
    for (var word in idfs) {
        // 在出现的文章数
        var count = idfs[word];
        idfs[word] = Math.log(newsList.length / (count + 1));
    }

    // return list.map(item => {
        
    // });
    for (var item of list) {
        item.tf_idfs = {};
        for (var word of item.words) {
            var tf = item.tfs[word] || 0;
            var idf = idfs[word] || 0;
            var tfidf = tf*idf;
            item.tf_idfs[word] = tfidf;
        }
    }

    return list;
}

// var newsList = JSON.parse(fs.readFileSync('./2018-04-17 01:55.txt').toString());
var newsList = JSON.parse(fs.readFileSync('./2018-04-18 09:23.txt').toString());

function get_tf_idf() {
    var idfs = {};
    // 同步读取 
    for (var news of newsList) {
        var words = jieba.cut(news.title).concat(jieba.cut(news.content));
        news.words = words;
        // 计算词频
        var freqDict = {};
        var maxCount = 0;
        for (var word of words) {
            freqDict[word] = typeof (freqDict[word]) === "undefined" ? 1 : freqDict[word] + 1;
            // 记录下最大值
            if (freqDict[word] > maxCount) {
                maxCount = freqDict[word];
            }
        }

        // 出现的次数除以最多的次数
        for (var word of words) {
            freqDict[word] = freqDict[word] / maxCount;
        }

        news.freqDict = freqDict;

        // 统计包含某词的文档数
        for (var word of new Set(words)) {
            idfs[word] = typeof (idfs[word]) === "undefined" ? 1 : idfs[word] + 1;
        }
    }

    // 计算idf
    for (var word in idfs) {
        // 在出现的文章数
        var count = idfs[word];
        idfs[word] = Math.log(newsList.length / (count + 1));
    }

    // 最后的结果
    var result = [];

    for (var news of newsList) {
        var tf_idfs = [];
        for (var word of new Set(news.words)) {
            var tf = news.freqDict[word] || 0;
            var idf = idfs[word] || 0;
            // 计算
            var tf_idf = tf * idf;
            tf_idfs.push({
                word: word,
                tf_idf: tf_idf
            });
        }
        // 按照 tf_idf 排序
        tf_idfs = tf_idfs.sort((a, b) => b.tf_idf - a.tf_idf);
        var newsTF_IDF = { title: news.title, tf_idf: tf_idfs };
        result.push(newsTF_IDF);
    }
    writeFile(result);
    return result;
}

// 写入文件
function writeFile(json) {
    var date = new Date();
    var dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    var filename = '曹昊-tfidf-' + dateString + '.txt';
    var string = "";
    for (var item of json) {
        string += item.title + item.tf_idf.reduce((a, b) => a + '\n' + b.word + " " + b.tf_idf, "\n") + "\n----------\n";
    }
    fs.writeFile('./' + filename, string, function (err) {
        if (err) throw err;
        console.log('已存在，内容被覆盖！');
    });
}

module.exports.get_tf_idf = get_tf_idf;
module.exports.newsList = newsList;