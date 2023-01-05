const mongoose = require('mongoose');

var Sms = mongoose.model('Sms',{
    text:{ type:String},
    phone:{ type:String},
    status:{type:String},
    groupId:{type:String},
    sendDate:{type:String}

});

module.exports = { Sms };

