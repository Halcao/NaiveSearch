var jieba = require("nodejieba");

function compare(s1, s2, type) {
    var words1 = jieba.cut(s1);
    // 句子1的向量;
    var vec1 = {};
    words1.forEach( e => {
        vec1[e] = typeof(vec1[e]) === 'undefined' ? 1 : vec1[e] + 1;
    });
    var vec2 = {};
    var words2 = jieba.cut(s2);
    words2.forEach( e => {
        vec2[e] = typeof(vec2[e]) === 'undefined' ? 1 : vec2[e] + 1;
    });
    switch (type) {
        case 'inner-product':
        var innerProduct = 0;
        for (var word of new Set(words1.concat(words2))) {
            var v1 = vec1[word] || 0;
            var v2 = vec2[word] || 0;
            innerProduct += v1*v2;
        }
        return innerProduct;
        case 'cos':
            // 向量内积
            var innerProduct = 0;
            for (var word of new Set(words1.concat(words2))) {
                var v1 = vec1[word] || 0;
                var v2 = vec2[word] || 0;
                innerProduct += v1*v2;
            }
            // 向量长度
            var s1Length = Object.keys(vec1).reduce((sum, key) => sum + vec1[key]*vec1[key], 0);
            var s2Length = Object.keys(vec2).reduce((sum, key) => sum + vec2[key]*vec2[key], 0);
            return innerProduct / (Math.sqrt(s1Length) * Math.sqrt(s2Length));
        case 'jaccard':
            var set1 = new Set(words1);
            var set2 = new Set(words2);
            var intersection = [...set1].filter(v => set2.has(v));
            return intersection.length/(new Set([...set1, ...set2]).size);
    }
}

module.exports = compare;