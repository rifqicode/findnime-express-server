const mongoose = require('mongoose');
var anime_episode = require('./anime_episode.schema');

anime_episode.statics = {
    create : function(data, cb) {
        var anime_episode = new this(data);
        anime_episode.save(cb);
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

    delete: function(query, cb) {
        this.findOneAndDelete(query,cb);
    }
}

var anime_episode = mongoose.model('AnimeEpisode', anime_episode);
module.exports = anime_episode;