/**
 * Created by flyman on 16-9-12.
 */
var date = new Date();

var setting = {
    date: date.getFullYear()+ '-' + (date.getMonth() + 1) + '-' + date.getDate(),
    // date: '2016-9-11',
    uploadDir: './storeFiles',
    userdata: 'users.json',
    dbFile: date.getFullYear()+ '-' + (date.getMonth() + 1) + '-' + date.getDate(),
    // dbFile: '2016-9-11',
    dbURL: "mongodb://localhost:27017/myproject"
};

module.exports = setting;