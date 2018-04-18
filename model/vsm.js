var jieba = require('nodejieba');

function search(keyword, database) {
    var words = jieba.cut(keyword);
    var vector1 = words.reduce(function(allElements, word) {
        allElements[word] = typeof(allElements[word]) === 'undefined' ? 1 : allElements[word] + 1;
        return allElements;
    }, {});
    var v1Length = Object.keys(vector1).reduce((a, b) => a + vector1[b]*vector1[b], 0);
    var result = [];
    for (var item of database) {
        var newsWords = jieba.cut(item.title).concat(jieba.cut(item.content));
        var vector2 = newsWords.reduce(function(allElements, word) {
            allElements[word] = typeof(allElements[word]) === 'undefined' ? 1 : allElements[word] + 1;
            return allElements;
        }, {});
        var v2Length = Object.keys(vector2).reduce((a, b) => a + vector2[b]*vector2[b], 0);
        var sum = 0;
        for (var key in vector1) {
            sum += vector1[key] * (vector2[key] || 0);
        }
        result.push({
            title: item.title,
            summary: item.content.replace(/\s/g, '').substring(0, 50),
            url: item.url,
            // 距离
            dist: sum / (Math.sqrt(v1Length)*Math.sqrt(v2Length))
        });
    }
    result.sort((a, b) => b.dist - a.dist);
    return result;
}


module.exports.search = search;
