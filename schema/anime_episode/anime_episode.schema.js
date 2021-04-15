const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var anime_episode = new Schema({
      header_link :{
            type: String,
            unique : false,
            required : true
      },
      anime_name : {
            type: String,
            unique : false,
            required : true
      },
      link_download : {
            type: String,
            unique : false,
            required : true
      }},
      { timestamps: true });

module.exports = anime_episode;