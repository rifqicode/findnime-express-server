const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var anime_ongoing = new Schema({
      anime_name :{
            type: String,
            unique : false,
            required : true
      },
      anime_image : {
            type: String,
            unique : false,
            required : true
      },
      anime_link : {
            type: String,
            unique : false,
            required : true
      },
      delete_flex: {
            type: Number,
            unique: false,
            required: true
      }},
      { timestamps: true });

module.exports = anime_ongoing;