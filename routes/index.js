var express = require('express');
var nodeExcel = require("excel-export");
var file = require('../modules/file');
var urs = require('../modules/user');
var setting = require('../setting');
var router = express.Router();

var returnList = [];  // 保存最近一次查询"list"的结果
var isNow;  // 标记是否为当天，是则为true；表示能修改数据库；否则不能修改
var returnDB; // 保存所有文档的名字和各自的记录个数

module.exports = function (database) {
    var userModule = new urs(database);
    /* GET home page. */
    router.get('/', function (req, res, next) {
        res.render('update', {title: "无资料登记"});
    });

    router.post('/update', function (req, res, next) {
        console.log("----->>>>>>>update");
        file.upload(req, res, userModule, function (user) {
            console.log("update: ", user);
            userModule.save(user);
        });
        res.redirect('/')
    });

    // 只有修改后或者直接输入list才会到list
    router.get('/list', function (req, res, next) {
        console.log("----->>>>>>>list");
        // if (returnList.length === 0) {
        //     userModule.findAll(function (result) {
        //         returnList = result;
        //         isNow = true;
        //         res.render('search', {title: "", list: result, date: setting.date});
        //     });
        // } else {
        //     res.render('search', {title: "", list: returnList, date: setting.date});
        // }
        userModule.findAll(function (result) {
            returnList = result;
            isNow = true;
            res.render('search', {title: "", list: result, date: setting.date});
        });
    });

    router.post('/delete/:id', function (req, res, next) {
        console.log('------>>>>>>delete: ', req.params.id);
        database.deleteDoc(req.params.id);
        res.redirect('/home', {title: "主页"});
    });

    router.get('/details/:id', function (req, res, next) {
        console.log('-------->>>>>>>details');
        console.log('ID: ', req.params.id);
        var id = req.params.id;
        console.log(returnList[id]);
        if (returnList.length == 0) {
            res.redirect('/list');
        } else {
            res.render('details', {title: "详情页", info: returnList[id], _id: id, isNow: isNow});
        }
    });

    // 只能修改当天的记录
    router.post('/modify', function (req, res, next) {
        console.log('----->>>>>>>modify');

        var id = req.body._id;
        req.body._id = returnList[id]._id;  // 将客户端的记录ID映射成服务端的记录ID
        console.log("Id: ", req.body._id, " ", id);

        var user = userModule.returnUser(req.body);
        console.log("user: ", user);
        userModule.update(user, function (result) {
            console.log("Modify Successfully");
            console.log("ID: ", id);
            returnList[id] = user;
            res.redirect('/list');
        });
    });

    router.get("/search", function (req, res, next) {
        console.log('----->>>>>>>search');
        var key = req.query.searchkey;

        // 根据学号或者中文姓名或日期来搜索
        if (key === undefined) {
            res.render('search', {list: []});
        } else if (/\d{4}\-\d{1,2}\-\d{1,2}/.test(key)) {
            database.listAccordingDate(key, function (err, users) {
                if (err) {
                    console.log('search fail: ' + err.message);
                }

                returnList = users;
                if (key === setting.date) {
                    isNow = true;
                } else {
                    isNow = false;
                }

                if (users.length > 0) {
                    res.render('search', {title: "", list: users, date: key});
                } else {
                    res.render('search', {title: "", list: users, date: ''});
                }
            });
        } else {
            var user = [];
            database.searchAllDoc({stdnum: key}, function (result) {
                if (result.length !== 0) {
                    user = user.concat(result);
                }
                database.searchAllDoc({name_zh: key}, function (result) {
                    if (result.length !== 0) {
                        user = user.concat(result);
                    }
                    returnList = user;
                    isNow = false;
                    console.log(returnList);
                    res.render('search', {title: "", list: user, date: ''});
                })
            })
        }
    });

    router.get("/photos/:id", function (req, res, next) {
        file.getPhoto(req.params.id, function (err, file, imgUrl) {
            if (err) {
                console.log("Read photo Fail: ", err.message);
            } else {
                console.log("Read photo Successfully");
                res.end(file);
            }
        })
    });

    router.get("/download", function (req, res) {
        file.exportExcel(returnList, function (conf) {
            if (conf.rows.length == 0) {
                res.redirect("/list");
                return;
            }
            var excel = nodeExcel.execute(conf);
            res.setHeader("Content-Type", "application/vnd.openxmlformats;charset=utf-8");
            res.setHeader("Content-Disposition", "attachment; filename=" + encodeURIComponent("资料列表") + ".xlsx");
            res.end(excel, "binary");
        });
    });

    router.get("/home", function (req, res, next) {
        database.getAllDocInfo(function (result) {
            returnDB = result;
            console.log(returnDB);
            res.render('home', {title: "主页", list: returnDB});
        })
    });
    
    // router.get("/login", function (req, res, next) {
    //
    // });

    return router;
};
