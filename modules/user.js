/**
 * Created by flyman on 16-9-12.
 */
var date = new Date();

var userModule = {
    _id: "",
    campus: "",
    academy: "",
    plptype: "",
    country: "",
    idnumber: "",
    stdnum: "",
    fullname: "",
    sname: "",
    name_zh: "",
    sname_zh: "",
    gname_zh: "",
    remark: "",
    updateDate: ""
};

function GUID() {
    var S4 = function () {
        return Math.floor(Math.random() * 0x10000 /* 65536 */).toString(16);
    };

    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
}

 module.exports = function (database) {
     this.returnUser = function (user) {
         userModule._id = user._id || GUID();
         userModule.campus = user.campus || "";
         userModule.academy = user.academy || "";
         userModule.plptype = user.plptype || "";
         userModule.country = user.country || "";
         userModule.idnumber = user.idnumber || "";
         userModule.stdnum = user.stdnum || "";
         userModule.fullname = user.fullname || "";
         userModule.sname = user.sname || "";
         userModule.name_zh = user.name_zh || "";
         userModule.sname_zh = user.sname_zh || "";
         userModule.gname_zh = user.gname_zh || "";
         userModule.remark = user.remark || "";
         userModule.updateDate = user.updateDate || (date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getHours() + ':' + date.getMinutes());
         return userModule;
     };
     
    this.save = function (user) {
        database.connect(function () {
            database.insert(user, function (result) {
                console.log("insert OK")
            })
        });
        
    };

    this.find = function (id, callback) {
        database.connect(function () {
            database.findOne(id, function (result) {
                console.log("Find OK");
                callback(result);
            })
        })
    };

    this.findAll = function (callback) {
        this.find({}, callback);
    };

    this.update = function (user, callback) {
        database.connect(function () {
            database.update(user, function (result) {
                console.log("Update Successfully");
                callback(result);
            })
        });
    };
    //
    // this.remove = function (id, callback) {
    //     database.connect(function () {
    //         database.removeOne(id, function (result) {
    //             console.log("Remove Successfully");
    //             callback();
    //         })
    //     });
    // };
    //
    // this.removeAll = function (callback) {
    //     this.remove({}, callback);
    // };
};
