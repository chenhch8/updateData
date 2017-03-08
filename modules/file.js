/**
 * Created by flyman on 16-8-29.
 */
var fs = require("fs");
var formidable = require("formidable");
var path = require('path');
var setting = require('../setting');

exports.upload = function (req, res, userModule, callback) {

    var storedir = path.join(setting.uploadDir, setting.date);
    console.log("----->>>>>>>storedir: " + storedir);
    var isexist = fs.existsSync(storedir);
    if (!isexist) {
        console.log("----->>>>>>>create dir");
        fs.mkdirSync(storedir);
    }

    var form = new formidable.IncomingForm(); // 创建form，用于解析客户端上传的表单文件

    form.encoding = 'utf-8';
    form.uploadDir = setting.uploadDir;
    form.keepExtensions = true;  // 保留文件扩展名
    form.maxFieldsSize = 2 * 1024 * 1024; // 设置上传文件大小
    form.multiples = true;  // 同时保存多个文件

    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log("---------->>>>>>>>>>>>>error： " + err.message);
        } else {
            var user = userModule.returnUser(fields);
            console.log("user: " + user);
            for (var index in files) {
                var file = files[index];

                var extname = path.extname(file.name);

                var newPath = path.join(storedir, user.stdnum + '.jpg');

                fs.rename(file.path, newPath, function (err, file) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("-----》》》》》》》》》store img successfully!");
                    }
                });
            }
            callback(user);
        }
    });
};

exports.getPhoto = function (id, callback) {
    id = id.replace('~', '/');
    console.log("ID: ", id);
    fs.readFile("./storeFiles/" + id, function (err, file) {
        callback(err, file, "./storeFiles/" + id);
    })
};

exports.exportExcel = function (userList, callback) {
    var conf = {};
    conf.cols = [
        {caption: "校区", type: "string"},
        {caption: "学院", type: "string"},
        {caption: "类型", type: "string"},
        {caption: "国籍", type: "string"},
        {caption: "身份证/护照", type: "string"},
        {caption: "学号/工号", type: "string"},
        {caption: "拼音/外文姓名", type: "string"},
        {caption: "拼音/外文姓", type: "string"},
        {caption: "中文姓名", type: "string"},
        {caption: "中文姓", type: "string"},
        {caption: "中文名", type: "string"},
        {caption: "备注/电话", type: "string"}
    ];
    conf.rows = [];

    var label = ['campus', 'academy', 'plptype', 'country', 'idnumber', 'stdnum',
                 'fullname', 'sname', 'name_zh', 'sname_zh', 'gname_zh', 'remark'];

    userList.forEach(function (user, index) {
        var temp = [];
        for (var i = 0; i < label.length; i++) {
            temp[i] = user[label[i]];
            console.log(user[label[i]]);
        }
        conf.rows.push(temp);
    });
    callback(conf);
};