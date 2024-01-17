const mongoose = require('mongoose');

const task = new mongoose.Schema({
    title:{
        type:String,
        required:true
    
      },
      description:{
        type:String,
        required:true
      },
      isDeleted:{
        type:Boolean,
        default:false
      },
    },{timestamps:true});

module.exports  = mongoose.model('task', task);