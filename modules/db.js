/**
 * Created by flyman on 16-9-12.
 */
 var mongodbClient = require("mongodb").MongoClient;
 var assert = require("assert");
 var setting = require("../setting");

 var url = setting.dbURL;
 var DB = null;
 var collection = null;

 module.exports = {
    start: function (callback) {
        if (DB == null) {
            mongodbClient.connect(url, function (err, db) {
                // assert.equal(null, err);
                console.log("Connected correctly to server");
                DB = db;
                callback();
            })
        } else {
            console.log("Has connected");
            callback();
        }
    },

    connect: function (callback) {
        if (collection === null) {
            collection = DB.collection(setting.dbFile);
        }
        callback();
    },

    close: function () {
        if (DB !== null) {
            DB.close();
            DB = collection = null;
        } else {
            console.log("no create");
        }
    },

    insert: function (user, callback) {
        if (collection !== null) {
            collection.insert(user, {safe: true}, function (err, result) {
                assert.equal(err, null);
                assert.equal(1, result.result.n);
                assert.equal(1, result.ops.length);
                console.log("Insert a user into " + setting.dbFile);
                callback(result);
            })
        } else {
            console.log("no collection");
        }
    },

    update: function (user, callback) {
        if (collection !== null) {
            collection.updateOne(
                {_id: user._id},
                {$set: user}, function (err, result) {
                    assert.equal(err, null);
                    console.log("Update Successfully");
                    callback(result);
                }
            )
        } else {
            console.log("no collection");
        }
    },

    findOne: function(id, callback) {
        if (collection !== null) {
            collection.find(id).toArray(function (err, users) {
                assert.equal(err, null);
                console.log("Found a user");
                callback(users);
            })
        }
    },

    findAll: function (callback) {
        this.findOne({}, callback);
    },

    removeOne: function(id, callback) {
        if (collection !== null) {
            collection.remove(id, function (err) {
                assert.equal(err, null);
                console.log("Delete All Successfully");
                callback();
            })
        }
    },

    removeAll: function (callback) {
        this.removeOne({}, callback);
    },

    deleteDoc: function (name) {
        DB.dropCollection(name);
    },

     // 根据输入的id来查找所有文档中符合条件的集合
    searchAllDoc: function (id, callback) {
        var results = [];

        DB.collections(function (err, collections) {
            if (err) {
                console.log("searchAllDoc error: " + err.message);
                return;
            }
            
            var sum = collections.length - 1;
            var count = 0;

            if (sum == 0) {
                callback([]);
            }

            collections.forEach(function (collection, index) {
                var name = collection.s.name;

                if (/\d{4}\-\d{1,2}\-\d{1,2}/.test(name)) {
                    var col = DB.collection(name);
                    col.find(id).toArray(function (err, users) {
                        count += 1;
                        if (err) {
                            console.log("search err: ", err.message);
                            return;
                        }
                        if (users.length !== 0) {
                            // console.log("find one.");
                            results = results.concat(users);
                        }

                        if (count === sum) {
                            callback(results);
                        }

                    });
                }
            })
        });
    },

     // 根据日期来生成列表
     listAccordingDate: function (dbDoc, callback) {
         var col = DB.collection(dbDoc);
         col.find({}).toArray(function (err, users) {
             callback(err, users);
         });
     },

     // 获取每个文档的记录个数
     getAllDocInfo: function (callback) {
         var results = {
             Doc: [],
             length: []
         };

         DB.collections(function (err, collections) {
             var sum = collections.length - 1;
             var count = 0;

             if (sum == 0) {
                 callback(results);
             }

             collections.sort(function(a, b) {
                 return b.s.name > a.s.name;
             });

             collections.forEach(function (collection, index) {
                 var name = collection.s.name;

                 if (/\d{4}\-\d{1,2}\-\d{1,2}/.test(name)) {
                     console.log(name);
                     var db = DB.collection(name);
                     db.find({}).toArray(function(err, result) {
                         count += 1;

                         var len = result.length;

                         results.Doc.push(name);
                         results.length.push(len);

                         if (count === sum) {
                             callback(results);
                         }
                     })
                 }
             });
         });

     }
};
