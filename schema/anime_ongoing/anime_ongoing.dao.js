const mongoose = require('mongoose');
var anime_ongoing = require('./anime_ongoing.schema');

anime_ongoing.statics = {
    create : function(data, cb) {
        var anime_ongoing = new this(data);
        anime_ongoing.save(cb);
    },

    get: function(query, cb) {
        this.find(query, cb);
    },

    getByName: function(query, cb) {
        this.find(query, cb);
    },

    update: function(query, updateData, cb) {
        this.findOneAndUpdate(query, {$set: updateData},{new: true}, cb);
    },
}

module.exports = mongoose.model('AnimeOngoing', anime_ongoing);