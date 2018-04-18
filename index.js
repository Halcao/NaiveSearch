var app = require('express')();
var tf_idf = require('./model/tf_idf');
var sim = require('./model/sim');
var vsm = require('./model/vsm');

//设置模板引擎为ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// var newsList = JSON.parse(fs.readFileSync('./2018-04-17 01:55.txt').toString());
// // tf_idf 数据
var database = tf_idf.get_tf_idf();

//index page
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/tf_idf', function(req, res) {
    var list = tf_idf.get_tf_idf();
    res.render('tf_idf', {
        list: list
    });
});

app.get('/sim', function(req, res) {
    res.render('sim');
});

app.get('/compare', function(req, res) {
    var s1 = req.query.s1;
    var s2 = req.query.s2;
    var type = req.query.type;
    var value = sim(s1, s2, type);
    res.send(JSON.stringify({value: value}));
    // res.render('sim');
});

app.get('/sjet', function(req, res) {
    res.render('sjet');
});

app.get('/search', function(req, res) {
    var keyword = req.query.keyword;
    var result = vsm.search(keyword, tf_idf.newsList);
    // res.render('sjet', {
    res.send(JSON.stringify(result));
    // })
});

// app.locals.abc = [];
//设置监听端口
app.listen(8080);
console.log('start server at 8080');
