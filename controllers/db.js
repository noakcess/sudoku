const mysql = require('mysql2');

var DB = {
    connection: false,
    init: function(callback) {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'frontend'
        });
        console.log('   [   DB.init ]', (this.connection ? true : false));
        if (typeof(callback) ==='function') {
            callback();
        }
    },
    execute: function (query, values, callback) {
        console.log('DB.query', query, values);
        this.connection.execute(
            query,
            values,
            function(err, results, fields) {
                if (err) {
                    console.log('DB.error', err);
                }
                // console.log('effected rows', results);
                var values = _.values(results);
                if (typeof(callback) === 'function') {
                    callback(values)
                }
            }
        );
    }
};

module.exports = DB;
