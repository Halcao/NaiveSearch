# Naive Search

> 一个简易的搜索引擎

------

## 概述：

本程序使用 Node.js 完成。使用 Express 框架以及 EJS 渲染模版。

## 实现功能：

1. TFIDF: 给定用自己名字命名的文件夹，请自己爬取一定数量的网页、微博形成语料集合，存入该文件夹；在线状态下，对其中的词语进行TFIDF统计，且输出到“姓名-tfidf-日期.txt“文件中。
2. SIM: 在线状态下，从网页页面输入任意两个句子，求其相似度，包括：内积，余弦及Jaccard三种度量方式；同时，可实现对导入的文件夹语料的tfidf统计。
3. SJet：实现基于向量空间模型（VSM）的搜索引擎。

## 依赖：

```
express: 4.16.3
nodejieba: 2.2.5
superagent: 3.8.2
cheerio: 1.0.0-rc.2
ejs: 2.5.8
```

## 使用方法：

```shel
npm install
npm start

# 访问 http://localhost:8080/
```

## 项目结构：

├── 2018-04-17\ 01:55.txt            — 爬取的数据
├── 2018-04-18\ 09:22.txt             — 爬取的数据
├── 2018-04-18\ 09:23.txt                — 爬取的数据
├── LICENSE                         — 开源协议
├── README.md                        — 文档
├── index.js                        — 主程序
├── model                                          — 工具目录
│   ├── crawl.js                          — 爬虫
│   ├── sim.js                                 — sim模块工具
│   ├── tf_idf.js                             — tf_idf工具
│   └── vsm.js                             — vsm工具
├── node_modules                         — 第三方库
├── package.json                         — 包信息
├── views                                         — 模版
│   ├── footer.ejs                         — footer模版
│   ├── head.ejs                         — html head模版
│   ├── header.ejs                         — header模版
│   ├── index.ejs                         — 主页模版
│   ├── sim.ejs                                 — sim模版
│   ├── sjet.ejs                                 — sjet模版
│   └── tf_idf.ejs                         — tf_idf模版
├── xx-tfidf-2018-4-17.txt             — 生成的tf_idf
└── xx-tfidf-2018-4-18.txt               — 生成的tf_idf
