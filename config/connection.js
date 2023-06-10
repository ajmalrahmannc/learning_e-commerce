const mongoClient = require('mongodb').MongoClient
var state = {
    db: ''
}

module.exports.connect = function (done) {
    const url = 'mongodb://localhost:27017'
    const dbname = 'shopping'

    mongoClient.connect(url, (err, data) => {
        if (err) return done(err)

        console.log('state.db', data);
        state.db = data.db(dbname)


    })
    done()
}

module.exports.get = function () {
    return state.db;
}